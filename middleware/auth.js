// /middleware/auth.js
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()

  // ถ้ายังไม่ login → ส่งไป login
  if (!auth.isAuthenticated) {
    return navigateTo('/profile')
  }
})
