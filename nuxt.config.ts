// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase', '@element-plus/nuxt', '@nuxt/eslint'],
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      cookieRedirect: true,
    },
  },
  elementPlus: {},
  eslint: {
    config: {
      stylistic: {
        semi: false,
        // ...
      },
    },
  },
})
