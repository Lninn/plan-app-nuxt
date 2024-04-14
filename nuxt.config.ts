// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase', '@element-plus/nuxt', '@nuxt/eslint', '@nuxtjs/color-mode'],
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://unpkg.com/open-props' },
        { rel: 'stylesheet', href: 'https://unpkg.com/open-props/normalize.min.css' },
        { rel: 'stylesheet', href: 'https://unpkg.com/open-props/theme.dark.switch.min.css' },
        { rel: 'stylesheet', href: 'https://unpkg.com/open-props/theme.light.switch.min.css' },
        { rel: 'stylesheet', href: 'https://unpkg.com/open-props/buttons.min.css' },
        { rel: 'stylesheet', href: 'https://unpkg.com/open-props/buttons.dark.min.css' },
        { rel: 'stylesheet', href: 'https://unpkg.com/open-props/buttons.light.min.css' },
      ],
    },
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      cookieRedirect: true,
    },
  },
  elementPlus: {
    themes: ['dark'],
  },
  css: [
    '~/assets/main.css',
  ],
  eslint: {
    config: {
      stylistic: {
        semi: false,
        // ...
      },
    },
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
  },
})
