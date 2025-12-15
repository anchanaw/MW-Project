import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()

  // ⏳ รอให้ store โหลดข้อมูลก่อน
  if (!auth.isReady) {
    await auth.init()
  }

  if (!auth.user) {
    return navigateTo("/profile")
  }
})

