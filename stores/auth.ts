import { defineStore } from "pinia"
import { ref } from "vue"

/* ===== types ===== */

interface Movie {
  id: number
  title: string
  year: number
  img: string
  rating?: number
  genres?: string
  runtime?: number
  overview?: string
  viewedAt?: string
  isViewed?: boolean
  watched?: boolean
}

interface Watchlist {
  id: number
  title: string
  description: string
  movies: Movie[]
}

interface User {
  id: number
  name: string
  email: string
  password?: string
  avatar: string | null
  watchlists: Watchlist[]
}

interface RegisterData {
  name: string
  email: string
  password: string
  avatar?: string | null
}

/* ================================ */

export const useAuthStore = defineStore("auth", () => {

  /* ================= STATE ================= */

  // ✅ สำคัญมาก: user เริ่มเป็น null
  const user = ref<User | null>(null)

  const token = ref<string | null>(null)
  const isAuthenticated = ref<boolean>(false)
  const isReady = ref<boolean>(false)

  /* ================= INIT ================= */

  function init(): void {
    if (!process.client) return

    const session: { id: number; token?: string } | null =
      JSON.parse(localStorage.getItem("auth_user") || "null")

    const users: User[] =
      JSON.parse(localStorage.getItem("users") || "[]")

    if (session) {
      const found = users.find(u => u.id === session.id)

      if (found) {
        // normalize watched flag
        found.watchlists?.forEach(list => {
          list.movies?.forEach(movie => {
            if (movie.watched === undefined) {
              movie.watched = false
            }
          })
        })

        user.value = { ...found }
        token.value = session.token || null
        isAuthenticated.value = true
      }
    }

    isReady.value = true
  }

  /* ================= REGISTER ================= */

  async function register(data: RegisterData): Promise<void> {
    const users: User[] =
      JSON.parse(localStorage.getItem("users") || "[]")

    if (users.some(u => u.email === data.email)) {
      alert("Email already exists")
      return
    }

    const newUser: User & { password: string } = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      avatar: data.avatar || null,
      watchlists: []
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    const session = {
      id: newUser.id,
      token: "TOKEN_" + newUser.id
    }
    localStorage.setItem("auth_user", JSON.stringify(session))

    user.value = { ...newUser }
    token.value = session.token
    isAuthenticated.value = true
  }

  /* ================= LOGIN ================= */

  async function loginWithCredentials(
    email: string,
    password: string
  ): Promise<boolean> {

    const users: (User & { password?: string })[] =
      JSON.parse(localStorage.getItem("users") || "[]")

    const found = users.find(u => u.email === email)
    if (!found) return false
    if (found.password !== password) return false

    const session = {
      id: found.id,
      token: "TOKEN_" + found.id
    }
    localStorage.setItem("auth_user", JSON.stringify(session))

    user.value = { ...found }
    token.value = session.token
    isAuthenticated.value = true

    return true
  }

  /* ================= LOGOUT ================= */

  function logout(): void {
    localStorage.removeItem("auth_user")
    user.value = null
    token.value = null
    isAuthenticated.value = false
  }

  /* ================= PROFILE ================= */

  function updateProfile(updatedData: Partial<User>): void {
    if (!user.value) return

    const users: User[] =
      JSON.parse(localStorage.getItem("users") || "[]")

    const index = users.findIndex(u => u.id === user.value!.id)
    if (index === -1) return

    users[index] = {
      ...users[index],
      ...updatedData
    }

    localStorage.setItem("users", JSON.stringify(users))

    // ✅ sync ทั้ง store และ session
    user.value = { ...users[index] }
    localStorage.setItem(
      "auth_user",
      JSON.stringify({ id: users[index].id, token: token.value })
    )
  }

  /* ================= WATCHLIST ================= */

  function addWatchlist(
    data: { title: string; description?: string },
    selectedMovie?: Movie
  ): void {
    if (!user.value) return

    const users: User[] =
      JSON.parse(localStorage.getItem("users") || "[]")

    const index = users.findIndex(u => u.id === user.value!.id)
    if (index === -1) return

    const newWatchlist: Watchlist = {
      id: Date.now(),
      title: data.title.trim(),
      description: data.description || "",
      movies: selectedMovie
        ? [{
          id: selectedMovie.id,
          title: selectedMovie.title,
          year: selectedMovie.year,
          img: selectedMovie.img,
          rating: selectedMovie.rating ?? 0,
          runtime: selectedMovie.runtime ?? 0,
          watched: false
        }]
        : []
    }

    users[index].watchlists ||= []
    users[index].watchlists.push(newWatchlist)
    localStorage.setItem("users", JSON.stringify(users))
    user.value = { ...users[index] }
  }

  function addMovieToWatchlist(
    listId: number,
    movie: Movie
  ): void {
    if (!user.value) return

    const users: User[] =
      JSON.parse(localStorage.getItem("users") || "[]")

    const index = users.findIndex(u => u.id === user.value!.id)
    if (index === -1) return

    const list = users[index].watchlists.find(w => w.id === listId)
    if (!list) return

    list.movies.push({
      id: movie.id,
      title: movie.title,
      year: movie.year,
      img: movie.img,
      rating: movie.rating ?? 0,
      runtime: movie.runtime ?? 0,
      watched: false
    })

    localStorage.setItem("users", JSON.stringify(users))
    user.value = { ...users[index] }
  }

  function toggleWatched(listId: number, movieId: number): void {
    if (!user.value) return

    const users: User[] =
      JSON.parse(localStorage.getItem("users") || "[]")

    const index = users.findIndex(u => u.id === user.value!.id)
    if (index === -1) return

    const list = users[index].watchlists.find(w => w.id === listId)
    if (!list) return

    const movie = list.movies.find(m => m.id === movieId)
    if (!movie) return

    movie.watched = !movie.watched
    localStorage.setItem("users", JSON.stringify(users))
    user.value = { ...users[index] }
  }

  function updateWatchlist(listId: number, updated: Watchlist): void {
    if (!user.value) return

    const users: User[] =
      JSON.parse(localStorage.getItem("users") || "[]")

    const index = users.findIndex(u => u.id === user.value!.id)
    if (index === -1) return

    const list = users[index].watchlists.find(w => w.id === listId)
    if (!list) return

    list.title = updated.title
    list.description = updated.description
    list.movies = updated.movies

    localStorage.setItem("users", JSON.stringify(users))
    user.value = { ...users[index] }
  }

  function deleteWatchlist(listId: number): void {
    if (!user.value) return

    const users: User[] =
      JSON.parse(localStorage.getItem("users") || "[]")

    const index = users.findIndex(u => u.id === user.value!.id)
    if (index === -1) return

    users[index].watchlists =
      users[index].watchlists.filter(w => w.id !== listId)

    localStorage.setItem("users", JSON.stringify(users))
    user.value = { ...users[index] }
  }

  /* ================= UTILS ================= */

  function getUnwatchedMinutes(): number {
    if (!user.value) return 0

    return user.value.watchlists
      .flatMap(list => list.movies || [])
      .filter(movie => movie.watched !== true)
      .reduce((total, movie) => total + (movie.runtime || 0), 0)
  }

  function formatRuntime(minutes: number): string {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h}h ${m}m`
  }

  function getUnwatchedRuntime(): string {
    return formatRuntime(getUnwatchedMinutes())
  }

  /* ================= EXPORT ================= */

  return {
    user,
    token,
    isAuthenticated,
    isReady,
    init,
    register,
    loginWithCredentials,
    logout,
    updateProfile,
    addWatchlist,
    addMovieToWatchlist,
    updateWatchlist,
    deleteWatchlist,
    toggleWatched,
    getUnwatchedMinutes,
    getUnwatchedRuntime,
    formatRuntime
  }
})
