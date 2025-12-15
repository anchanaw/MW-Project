import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()

  if (!auth.isReady) return

  if (!auth.isAuthenticated) {
    return navigateTo("/profile")
  }
})
