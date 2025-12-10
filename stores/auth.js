// /stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // STATE
  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = ref(false)
  const showLoginModal = ref(false)

  // LOAD AUTH DATA (LOCAL STORAGE)
  function init() {
    if (process.client) {
      try {
        const raw = localStorage.getItem('myapp_auth')
        if (raw) {
          const data = JSON.parse(raw)
          user.value = data.user || null
          token.value = data.token || null
          isAuthenticated.value = !!data.token
        }
      } catch (e) {
        console.warn("auth.init error:", e)
      }
    }
  }

  // SAVE AUTH DATA
  function persist() {
    if (process.client) {
      try {
        localStorage.setItem(
          "myapp_auth",
          JSON.stringify({
            user: user.value,
            token: token.value,
          })
        )
      } catch (e) {
        console.warn("auth.persist error:", e)
      }
    }
  }

  // LOGIN
  async function loginWithCredentials(email, password) {
    // TODO: เรียก API จริงได้
    const fakeUser = {
      id: 1,
      name: "John Doe",
      email: email,
    }

    token.value = "FAKE_TOKEN_123"
    user.value = fakeUser
    isAuthenticated.value = true

    persist()
  }

  // REGISTER (เพิ่มให้)
  async function register(formData) {
    // TODO: เรียก API สมัครสมาชิกจริงได้
    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
    }

    token.value = "REGISTER_TOKEN_123"
    user.value = newUser
    isAuthenticated.value = true

    persist()
  }

  // PROFILE
  function getProfile() {
    return user.value
  }

  // LOGOUT
  function logout() {
    token.value = null
    user.value = null
    isAuthenticated.value = false

    if (process.client) {
      localStorage.removeItem("myapp_auth")
    }
  }

  // LOGIN MODAL CONTROL
  function openLoginModal() {
    showLoginModal.value = true
  }
  function closeLoginModal() {
    showLoginModal.value = false
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
    getProfile,

    openLoginModal,
    closeLoginModal,
  }
})
