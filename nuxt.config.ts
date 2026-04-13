// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  app: {
    head: {
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-GMZHWT1R9L',
          async: true
        },
        {
          innerHTML: `
           window.dataLayer = window.dataLayer || [];
           function gtag(){dataLayer.push(arguments);}
           gtag('js', new Date());
        
           gtag('config', 'G-GMZHWT1R9L');
          `
        }
      ]
    }
  },
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
      /** When true: monthly Pro may use POST /billing/mvp-promo/activate while window is open */
      mvpPromoTrial: ['true', '1', 'yes'].includes(
        String(process.env.NUXT_PUBLIC_MVP_PROMO_TRIAL || '').toLowerCase().trim()
      ),
      /** ISO date (e.g. 2025-01-01) — start of MVP free-new-user window */
      mvpPromoCampaignStartAt:
        process.env.NUXT_PUBLIC_BILLING_MVP_PROMO_CAMPAIGN_START_AT
        || process.env.BILLING_MVP_PROMO_CAMPAIGN_START_AT
        || '',
      /** Days from start — after this, free MVP activation ends; Stripe monthly/yearly applies */
      mvpPromoNewUserWindowDays: Number.parseInt(
        String(
          process.env.NUXT_PUBLIC_BILLING_MVP_PROMO_NEW_USER_WINDOW_DAYS
          || process.env.BILLING_MVP_PROMO_NEW_USER_WINDOW_DAYS
          || '0',
        ),
        10,
      ) || 0,
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
    cacheMaxAgeSeconds: 3600,
  }
})
