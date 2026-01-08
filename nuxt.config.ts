// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/google-fonts','@pinia/nuxt'],
  // @ts-ignore
  googleFonts: {
    families: {
      Lato: [300, 400, 700]
    },
    display: 'swap'
  },

 css: [
    '~/assets/css/reset.css',
    '~/assets/css/responsive.css'
  ]
})
