// stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {

  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = ref(false)

  // ⭐ โหลดข้อมูล session ตอนเริ่ม
  function init() {
    const session = JSON.parse(localStorage.getItem("auth_user"))
    const users = JSON.parse(localStorage.getItem("users")) || []

    if (session) {
      const found = users.find(u => u.id === session.id)
      if (found) {
        user.value = found
        token.value = session.token
        isAuthenticated.value = true
      }
    }
  }

  // ⭐ REGISTER แบบหลายบัญชี
  async function register(data) {
    let users = JSON.parse(localStorage.getItem("users")) || []

    // ❗ กัน email ซ้ำ
    if (users.some(u => u.email === data.email)) {
      alert("Email already exists")
      return
    }

    const newUser = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      avatar: data.avatar || null
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    // Login อัตโนมัติหลังสมัคร
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

  // ⭐ LOGOUT (สำคัญสุด!)
  function logout() {
    // ❗ ไม่ลบ users
    // ลบเฉพาะ session
    localStorage.removeItem("auth_user")

    user.value = null
    token.value = null
    isAuthenticated.value = false
  }

  return {
    user,
    token,
    isAuthenticated,
    init,
    register,
    loginWithCredentials,
    logout,
  }
})
