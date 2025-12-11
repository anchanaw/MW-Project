// stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {

  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = ref(false)

  // ⭐ โหลด session เมื่อเข้าเว็บ
  function init() {
    const session = JSON.parse(localStorage.getItem("auth_user"));
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (session) {
      const found = users.find(u => u.id === session.id);
      if (found) {
        user.value = found;
        token.value = session.token;
        isAuthenticated.value = true;
      }
    }
  }

  // ⭐ REGISTER แบบ Multi-user
  async function register(data) {
    let users = JSON.parse(localStorage.getItem("users")) || []

    // กัน email ซ้ำ
    if (users.some(u => u.email === data.email)) {
      alert("Email already exists")
      return
    }

    const newUser = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      avatar: data.avatar || null,
      watchlists: []     // ⭐ ทุก user ใหม่ต้องมี watchlists array
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    // login อัตโนมัติหลังสมัคร
    const session = {
      id: newUser.id,
      token: "TOKEN_" + newUser.id
    }
    localStorage.setItem("auth_user", JSON.stringify(session))

    user.value = newUser
    token.value = session.token
    isAuthenticated.value = true
  }


  // ⭐ LOGIN
  async function loginWithCredentials(email, password) {
    const users = JSON.parse(localStorage.getItem("users")) || []

    const found = users.find(u => u.email === email)
    if (!found) return alert("Email not found")
    if (found.password !== password) return alert("Incorrect password")

    const session = {
      id: found.id,
      token: "TOKEN_" + found.id
    }
    localStorage.setItem("auth_user", JSON.stringify(session))

    user.value = found
    token.value = session.token
    isAuthenticated.value = true
  }


  // ⭐ LOGOUT — ลบเฉพาะ session (ไม่ลบบัญชี)
  function logout() {
    localStorage.removeItem("auth_user")

    user.value = null
    token.value = null
    isAuthenticated.value = false
  }


  // ⭐ ADD WATCHLIST (แบบสมบูรณ์ รองรับ description)
  function addWatchlist({ title, description }) {

  // กันชื่อว่าง
  if (!title || !title.trim()) {
    alert("Please enter a title");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const index = users.findIndex(u => u.id === user.value?.id);

  if (index === -1) {
    alert("User not found");
    return;
  }

  const newWatchlist = {
    id: Date.now(),
    title: title.trim(),
    description: description?.trim() || "",
    movies: []
  };

  // ถ้า watchlists ไม่มี ให้สร้าง array ใหม่
  if (!Array.isArray(users[index].watchlists)) {
    users[index].watchlists = [];
  }

  users[index].watchlists.push(newWatchlist);

  // อัปเดต users
  localStorage.setItem("users", JSON.stringify(users));

  // อัปเดต user reactive ใน Pinia
  user.value = users[index];

  alert("Watchlist created!");
}

  function addMovieToWatchlist(listId, movie) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const index = users.findIndex(u => u.id === user.value.id);

  if (index === -1) return;

  const list = users[index].watchlists.find(w => w.id === listId);
  if (!list) return;

  // กันซ้ำ
  if (list.movies.some(m => m.id === movie.id)) {
    alert("Movie is already in this watchlist");
    return;
  }

  list.movies.push({
    id: movie.id,
    title: movie.title,
    year: movie.year,
    score: movie.score || 0,
    poster: movie.poster
  });

  localStorage.setItem("users", JSON.stringify(users));
  user.value = users[index];
}

  return {
  user,
  token,
  isAuthenticated,
  init,
  register,
  loginWithCredentials,
  logout,
  addWatchlist,   // ต้องมี!
  addMovieToWatchlist // ถ้าคุณมีฟังก์ชันนี้
}

})
