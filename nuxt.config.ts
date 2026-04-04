// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      /** Canonical site origin for share links (e.g. https://linkbycode.com). Falls back to current host in dev. */
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || '',
      apiBase: (() => {
        const raw = process.env.NUXT_PUBLIC_API_BASE || process.env.VITE_APP_MAIN_BASE_URL || ''
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
      billingProYearlyLabel: process.env.NUXT_PUBLIC_BILLING_PRO_PRICE_YEARLY_LABEL || '$15.99/yr',
      /** When true: monthly Pro uses POST /billing/mvp-promo/activate (free trial); yearly is coming soon; Stripe checkout only when false */
      mvpPromoTrial: ['true', '1', 'yes'].includes(
        String(process.env.NUXT_PUBLIC_MVP_PROMO_TRIAL || '').toLowerCase().trim()
      )
    }
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: ['@element-plus/nuxt', '@nuxt/eslint', '@nuxtjs/sitemap'],
  site: {
    url: 'https://getlinkid.com',
    name: 'Find Products by Code – Link by Code'
  },
  sitemap: {
    // ❌ Private sahifalarni chiqaramiz
    exclude: [
      '/dashboard/**',
      '/auth/**',
    ],

    // ✅ Public sahifalar
    include: [
      '/',
      '/u/**'
    ],

    // 🔥 ENG MUHIM QISM (dynamic users)
    sources: [
      'https://api.linkbycode.com/api/public/sitemap-users'
    ],

    // 🔥 performance uchun (tavsiya)
    cacheMaxAgeSeconds: 0,
  }
})
