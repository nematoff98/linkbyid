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
      })(),
      stripePriceProMonthlyId:
        process.env.NUXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY_ID
        || process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY_ID
        || process.env.VITE_STRIPE_PRICE_PRO_MONTHLY_ID
        || '',
      stripePriceProYearlyId:
        process.env.NUXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY_ID
        || process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY_ID
        || process.env.VITE_STRIPE_PRICE_PRO_YEARLY_ID
        || '',
      /** Display labels (must match your Stripe products; env overrides defaults) */
      billingProMonthlyLabel: process.env.NUXT_PUBLIC_BILLING_PRO_PRICE_MONTHLY_LABEL || '$1.99/mo',
      billingProYearlyLabel: process.env.NUXT_PUBLIC_BILLING_PRO_PRICE_YEARLY_LABEL || '$15.99/yr'
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