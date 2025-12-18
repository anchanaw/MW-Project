import { defineStore } from 'pinia'
import { ref } from 'vue'

/* ===== types (เพิ่มอย่างเดียว) ===== */

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
  id: number | null
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

export const useAuthStore = defineStore('auth', () => {

  const user = ref<User>({
    id: null,
    name: "",
    email: "",
    avatar: null,
    watchlists: []
  })

  const token = ref<string | null>(null)
  const isAuthenticated = ref<boolean>(false)
  const isReady = ref<boolean>(false)

  // โหลด session ตอนเปิดเว็บ
  function init(): void {
    const session: { id: number } | null =
      JSON.parse(localStorage.getItem("auth_user") || 'null')

    const users: User[] =
      JSON.parse(localStorage.getItem("users") || '[]')

    if (session) {
      const found = users.find(u => u.id === session.id)

      if (found) {
        found.watchlists?.forEach(list => {
          list.movies?.forEach(movie => {
            if (movie.watched === undefined) {
              movie.watched = false
            }
          })
        })

        Object.assign(user.value, found)
        isAuthenticated.value = true
      }
    }

    isReady.value = true
  }

  // REGISTER
  async function register(data: RegisterData): Promise<void> {
    let users: User[] =
      JSON.parse(localStorage.getItem("users") || '[]')

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

    Object.assign(user.value, newUser)
    token.value = session.token
    isAuthenticated.value = true
  }

  // LOGIN
  async function loginWithCredentials(
    email: string,
    password: string
  ): Promise<void> {
    const users: (User & { password?: string })[] =
      JSON.parse(localStorage.getItem("users") || '[]')

    const found = users.find(u => u.email === email)

    if (!found) return alert("Email not found")
    if (found.password !== password) return alert("Incorrect password")

    const session = {
      id: found.id as number,
      token: "TOKEN_" + found.id
    }
    localStorage.setItem("auth_user", JSON.stringify(session))

    Object.assign(user.value, found)
    token.value = session.token
    isAuthenticated.value = true
  }

  // LOGOUT
  function logout(): void {
    localStorage.removeItem("auth_user")

    Object.assign(user.value, {
      id: null,
      name: "",
      email: "",
      avatar: null,
      watchlists: []
    })

    token.value = null
    isAuthenticated.value = false
  }

  function getUnwatchedMinutes(): number {
    return user.value.watchlists
      .flatMap(list => list.movies || [])
      .filter(movie => movie.watched !== true)
      .reduce((total, movie) => total + (movie.runtime || 0), 0)
  }

  // CREATE WATCHLIST
  function addWatchlist(
    { title, description }: { title: string; description?: string },
    selectedMovie: Movie
  ): void {
    const users: User[] =
      JSON.parse(localStorage.getItem("users") || '[]')

    const index = users.findIndex(u => u.id === user.value.id)
    if (index === -1) return

    const newWatchlist: Watchlist = {
      id: Date.now(),
      title: title.trim(),
      description: description || "",
      movies: []
    }

    users[index].watchlists.push(newWatchlist)
    localStorage.setItem("users", JSON.stringify(users))

    user.value = { ...users[index] }
  }

  function formatRuntime(minutes: number): string {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h}h ${m}m`
  }

  function getUnwatchedRuntime(): string {
    const minutes = getUnwatchedMinutes()
    return formatRuntime(minutes)
  }

  // ADD MOVIE TO LIST
  function addMovieToWatchlist(
    listId: number,
    movie: Movie
  ): void {
    const users: User[] =
      JSON.parse(localStorage.getItem("users") || '[]')

    const index = users.findIndex(u => u.id === user.value.id)
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

  function toggleWatched(
    listId: number,
    movieId: number
  ): void {
    const users: User[] =
      JSON.parse(localStorage.getItem("users") || '[]')

    const userIndex = users.findIndex(u => u.id === user.value.id)
    if (userIndex === -1) return

    const list = users[userIndex].watchlists.find(w => w.id === listId)
    if (!list) return

    const movie = list.movies.find(m => m.id === movieId)
    if (!movie) return

    movie.watched = !movie.watched
    localStorage.setItem("users", JSON.stringify(users))
    Object.assign(user.value, users[userIndex])
  }

  function updateWatchlist(
    listId: number,
    updated: Watchlist
  ): void {
    const users: User[] =
      JSON.parse(localStorage.getItem("users") || '[]')

    const index = users.findIndex(u => u.id === user.value.id)
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
    const users: User[] =
      JSON.parse(localStorage.getItem("users") || '[]')

    const index = users.findIndex(u => u.id === user.value.id)
    if (index === -1) return

    users[index].watchlists =
      users[index].watchlists.filter(w => w.id !== listId)

    localStorage.setItem("users", JSON.stringify(users))
    user.value = { ...users[index] }
  }

  function updateProfile(updatedData: Partial<User>): void {
    const users: User[] =
      JSON.parse(localStorage.getItem("users") || '[]')

    const index = users.findIndex(u => u.id === user.value.id)
    if (index === -1) return

    users[index] = {
      ...users[index],
      ...updatedData
    }

    localStorage.setItem("users", JSON.stringify(users))
    user.value = { ...users[index] }
  }

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
    getUnwatchedMinutes,
    getUnwatchedRuntime,
    formatRuntime,
    toggleWatched
  }

})
