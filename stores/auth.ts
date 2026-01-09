import { defineStore } from 'pinia'
import { ref } from 'vue'

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

export const useAuthStore = defineStore('auth', () => {

  /* ================= STATE ================= */

  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isReady = ref(false)

  /* ================= INIT ================= */
  // โหลด session ตอน refresh หน้า
  function init(): void {
    if (typeof window === 'undefined') return

    const raw = localStorage.getItem('auth_user')
    if (!raw) {
      user.value = null
      isAuthenticated.value = false
      isReady.value = true
      return
    }

    let session: any
    try {
      session = JSON.parse(raw)
    } catch {
      localStorage.removeItem('auth_user')
      user.value = null
      isAuthenticated.value = false
      isReady.value = true
      return
    }

    if (typeof session.id !== 'number') {
      localStorage.removeItem('auth_user')
      user.value = null
      isAuthenticated.value = false
      isReady.value = true
      return
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const found = users.find((u: any) => u.id === session.id)

    if (!found) {
      localStorage.removeItem('auth_user')
      user.value = null
      isAuthenticated.value = false
      isReady.value = true
      return
    }

    user.value = { ...found }
    isAuthenticated.value = true
    isReady.value = true
  }

  /* ================= REGISTER ================= */
  async function register(data: RegisterData): Promise<void> {
    const users =
      JSON.parse(localStorage.getItem("users") || "[]")

    if (users.some((u: { email: string }) => u.email === data.email)) {
      alert("Email already exists")
      return
    }

    // 🔥 บังคับ id ตรงนี้
    const newUser = {
      id: Date.now(),              // ✅ ต้องมี
      name: data.name,
      email: data.email,
      password: data.password,
      avatar: data.avatar || null,
      watchlists: []
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    // 🔥 session ต้องเขียน id จากตรงนี้
    localStorage.setItem(
      "auth_user",
      JSON.stringify({ id: newUser.id })
    )

    user.value = { ...newUser }
    isAuthenticated.value = true
  }

  /* ================= LOGIN ================= */
  async function loginWithCredentials(email: string, password: string) {
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    const found = users.find(
      (u: any) =>
        u.email?.trim() === email.trim() &&
        u.password === password
    )

    if (!found) {
      alert("Email or password is incorrect")
      return false
    }

    // 🔥 guard สำคัญมาก
    if (typeof found.id !== "number") {
      console.error("❌ USER HAS NO ID", found)
      alert("User data corrupted. Please register again.")
      return false
    }

    localStorage.setItem(
      "auth_user",
      JSON.stringify({ id: found.id })
    )

    user.value = { ...found }
    isAuthenticated.value = true
    return true
  }

  /* ================= LOGOUT ================= */
  function logout(): void {
    localStorage.removeItem('auth_user')
    user.value = null
    isAuthenticated.value = false
  }

  /* ================= PROFILE ================= */
  function updateProfile(updatedData: Partial<User>): void {
    if (!user.value) return

    const users: User[] =
      JSON.parse(localStorage.getItem('users') || '[]')

    const index = users.findIndex(u => u.id === user.value!.id)
    if (index === -1) return

    users[index] = {
      ...users[index],
      ...updatedData
    }

    localStorage.setItem('users', JSON.stringify(users))
    user.value = { ...users[index] }
  }

  /* ================= WATCHLIST ================= */

  function addWatchlist(
    data: { title: string; description?: string },
    selectedMovie?: Movie
  ): void {
    if (!user.value) return

    const users: User[] =
      JSON.parse(localStorage.getItem('users') || '[]')

    const index = users.findIndex(u => u.id === user.value!.id)
    if (index === -1) return

    const newWatchlist: Watchlist = {
      id: Date.now(),
      title: data.title.trim(),
      description: data.description || '',
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

    users[index].watchlists.push(newWatchlist)
    localStorage.setItem('users', JSON.stringify(users))
    user.value = { ...users[index] }
  }

  function addMovieToWatchlist(
    listId: number,
    movie: Movie
  ): void {
    if (!user.value) return

    const users: User[] =
      JSON.parse(localStorage.getItem('users') || '[]')

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

    localStorage.setItem('users', JSON.stringify(users))
    user.value = { ...users[index] }
  }

  function toggleWatched(
    listId: number,
    movieId: number
  ): void {
    if (!user.value) return

    const users: User[] =
      JSON.parse(localStorage.getItem('users') || '[]')

    const index = users.findIndex(u => u.id === user.value!.id)
    if (index === -1) return

    const list = users[index].watchlists.find(w => w.id === listId)
    if (!list) return

    const movie = list.movies.find(m => m.id === movieId)
    if (!movie) return

    movie.watched = !movie.watched
    localStorage.setItem('users', JSON.stringify(users))
    user.value = { ...users[index] }
  }

  function updateWatchlist(
    listId: number,
    updated: Watchlist
  ): void {
    if (!user.value) return

    const users: User[] =
      JSON.parse(localStorage.getItem('users') || '[]')

    const index = users.findIndex(u => u.id === user.value!.id)
    if (index === -1) return

    const list = users[index].watchlists.find(w => w.id === listId)
    if (!list) return

    list.title = updated.title
    list.description = updated.description
    list.movies = updated.movies

    localStorage.setItem('users', JSON.stringify(users))
    user.value = { ...users[index] }
  }

  function deleteWatchlist(listId: number): void {
    if (!user.value) return

    const users: User[] =
      JSON.parse(localStorage.getItem('users') || '[]')

    const index = users.findIndex(u => u.id === user.value!.id)
    if (index === -1) return

    users[index].watchlists =
      users[index].watchlists.filter(w => w.id !== listId)

    localStorage.setItem('users', JSON.stringify(users))
    user.value = { ...users[index] }
  }

  /* ================= EXPORT ================= */

  return {
    user,
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
    toggleWatched
  }
})
