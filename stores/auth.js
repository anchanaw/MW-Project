import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useAuthStore = defineStore('auth', () => {

  const user = ref({
    id: null,
    name: "",
    email: "",
    avatar: null,
    watchlists: []
  });

  const token = ref(null)
  const isAuthenticated = ref(false)
  const isReady = ref(false)
  // โหลด session ตอนเปิดเว็บ
  function init() {
    const session = JSON.parse(localStorage.getItem("auth_user"))
    const users = JSON.parse(localStorage.getItem("users")) || []

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
  async function register(data) {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some(u => u.email === data.email)) {
      alert("Email already exists");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      avatar: data.avatar || null,
      watchlists: []
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    const session = {
      id: newUser.id,
      token: "TOKEN_" + newUser.id
    };
    localStorage.setItem("auth_user", JSON.stringify(session));

    // อัปเดต reactive
    Object.assign(user.value, newUser);
    token.value = session.token;
    isAuthenticated.value = true;
  }

  // LOGIN
  async function loginWithCredentials(email, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find(u => u.email === email);

    if (!found) return alert("Email not found");
    if (found.password !== password) return alert("Incorrect password");

    const session = {
      id: found.id,
      token: "TOKEN_" + found.id
    };
    localStorage.setItem("auth_user", JSON.stringify(session));

    // อัปเดต reactive
    Object.assign(user.value, found);
    token.value = session.token;
    isAuthenticated.value = true;
  }

  // LOGOUT
  function logout() {
    localStorage.removeItem("auth_user");

    // reset แต่ยัง reactive
    Object.assign(user.value, {
      id: null,
      name: "",
      email: "",
      avatar: null,
      watchlists: []
    });

    token.value = null;
    isAuthenticated.value = false;
  }

  function getUnwatchedMinutes() {
    return user.value.watchlists
      .flatMap(list => list.movies || [])
      .filter(movie => movie.watched !== true)
      .reduce((total, movie) => total + (movie.runtime || 0), 0)
  }

  // CREATE WATCHLIST
  function addWatchlist({ title, description }, selectedMovie: { id: number; title: string; year: number; img: string; rating?: number | undefined; genres?: string | undefined; runtime?: number | undefined; overview?: string | undefined; viewedAt?: string | undefined; isViewed?: boolean | undefined; }) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const index = users.findIndex(u => u.id === user.value.id);
    if (index === -1) return;

    const newWatchlist = {
      id: Date.now(),
      title: title.trim(),
      description: description || "",
      movies: []
    };

    users[index].watchlists.push(newWatchlist);
    localStorage.setItem("users", JSON.stringify(users));

    // อัปเดต reactive
    Object.assign(user.value, users[index]);
  }

  function formatRuntime(minutes) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h}h ${m}m`
  }

  function getUnwatchedRuntime() {
    const minutes = getUnwatchedMinutes()
    return formatRuntime(minutes)
  }


  // ADD MOVIE TO LIST
  function addMovieToWatchlist(listId, movie) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const index = users.findIndex(u => u.id === user.value.id);
    if (index === -1) return;

    const list = users[index].watchlists.find(w => w.id === listId);
    if (!list) return;

    list.movies.push({
      id: movie.id,
      title: movie.title,
      year: movie.year,
      img: movie.img,
      rating: movie.rating ?? 0,
      runtime: movie.runtime ?? 0,
      watched: false
    });

    localStorage.setItem("users", JSON.stringify(users));

    // อัปเดต reactive
    Object.assign(user.value, users[index]);
  }

  function toggleWatched(listId, movieId) {
    const users = JSON.parse(localStorage.getItem("users")) || []

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

  function updateWatchlist(listId, updated) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const index = users.findIndex(u => u.id === user.value.id);
    if (index === -1) return;

    const list = users[index].watchlists.find(w => w.id === listId);
    if (!list) return;

    list.title = updated.title;
    list.description = updated.description;
    list.movies = updated.movies;

    localStorage.setItem("users", JSON.stringify(users));
    Object.assign(user.value, users[index]);
  }

  function deleteWatchlist(listId) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const index = users.findIndex(u => u.id === user.value.id);
    if (index === -1) return;

    users[index].watchlists = users[index].watchlists.filter(w => w.id !== listId);

    localStorage.setItem("users", JSON.stringify(users));
    Object.assign(user.value, users[index]);
  }

  function updateProfile(updatedData) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const index = users.findIndex(u => u.id === user.value.id);

    if (index === -1) return;

    // อัปเดตข้อมูล user
    users[index] = {
      ...users[index],
      ...updatedData
    };

    localStorage.setItem("users", JSON.stringify(users));

    Object.assign(user.value, users[index]);
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

});
