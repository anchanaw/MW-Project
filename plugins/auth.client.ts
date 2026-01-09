import { defineNuxtPlugin } from "nuxt/app"
import { useAuthStore } from "../stores/auth"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:mounted", () => {
    const auth = useAuthStore()
  })
})

