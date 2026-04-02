// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: (() => {
        const raw = process.env.NUXT_PUBLIC_API_BASE_URL || process.env.NUXT_PUBLIC_API_BASE || process.env.VITE_APP_MAIN_BASE_URL || 'http://localhost:4000'
        return raw.replace(/\/+$/, '').replace(/\/api$/, '')
      })()
    }
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: ['@element-plus/nuxt', '@nuxt/eslint'],
})