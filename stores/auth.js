// /stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // STATE
  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = ref(false)
  const showLoginModal = ref(false)

  // LOAD AUTH DATA
  function init() {
    if (process.client) {
      const raw = localStorage.getItem('myapp_auth')
      if (raw) {
        const data = JSON.parse(raw)
        user.value = data.user
        token.value = data.token
        isAuthenticated.value = !!data.token
      }
    }
  }

  // SAVE AUTH DATA
  function persist() {
    if (!process.client) return
    localStorage.setItem(
      "myapp_auth",
      JSON.stringify({
        user: user.value,
        token: token.value,
      })
    )
  }

  // ⭐ REGISTER (เก็บ avatar จริง)
  async function register(data) {
    const newUser = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      avatar: data.avatar || null    // ⭐ base64 avatar stored
    }

    // ⭐ เซฟถูกที่แล้ว (myapp_auth) แทน myapp_user เดิม
    user.value = newUser
    token.value = "REGISTER_TOKEN"
    isAuthenticated.value = true

    persist()
  }

  // ⭐ LOGIN (โหลด user ที่เคย register)
  async function loginWithCredentials(email, password) {

    // โหลดข้อมูลที่ register ไว้
    const raw = localStorage.getItem("myapp_auth")
    if (!raw) return
    
    const saved = JSON.parse(raw)

    // ตรวจ email & password (mock)
    if (saved.user.email !== email) return alert("Email not found")
    if (saved.user.password !== password) return alert("Incorrect password")

    user.value = saved.user      // ⭐ avatar ถูกโหลดครบถ้วน
    token.value = "FAKE_LOGIN_TOKEN"
    isAuthenticated.value = true

    persist()
  }

  // LOGOUT
  function logout() {
    token.value = null
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem("myapp_auth")
  }

  return {
    user,
    token,
    isAuthenticated,
    showLoginModal,

    init,
    persist,
    loginWithCredentials,
    register,
    logout,
  }
})
