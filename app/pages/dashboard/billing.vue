<script setup lang="ts">
import BillingPlanCard from '~/components/dashboard/BillingPlanCard.vue'
import PaymentHistoryTable from '~/components/dashboard/PaymentHistoryTable.vue'
import PricingCard from '~/components/dashboard/PricingCard.vue'

definePageMeta({ layout: 'dashboard' })

const {
  billingPageSubscription,
  payments,
  actionLoading,
  transactionsLoading,
  actionLabel,
  billingCycleChoice,
  checkoutError,
  getPriceIdForChoice,
  mvpPromoTrialEnabled,
  startProCheckout,
  openBillingPortal,
  loadTransactions,
  fetchBillingPageSubscription
} = useBillingData()

const { mvpPromoTrialFlag, isPromoWindowOpen, promoWindowEndsLabel } = useMvpPromoCampaign()

/** Skeleton until GET /billing/subscription/:id completes (avoids flashing Free before Pro). */
const billingUiReady = ref(false)

const { accessToken } = useAuthSession()
const config = useRuntimeConfig()

const freeFeatures = ['Up to 10 links', 'Simple profile']
const proFeatures = ['Unlimited links', 'Analytics', 'Theme', 'Tickets']

const handleAction = () => {
  openBillingPortal()
}

const goLogin = () => navigateTo({ path: '/login', query: { redirect: '/dashboard/billing' } })

let loginRedirectTimer: ReturnType<typeof setTimeout> | null = null
onMounted(async () => {
  if (!accessToken.value) {
    loginRedirectTimer = setTimeout(() => {
      navigateTo({ path: '/login', query: { redirect: '/dashboard/billing' } })
    }, 2800)
    return
  }
  billingUiReady.value = false
  await fetchBillingPageSubscription()
  billingUiReady.value = true
  void loadTransactions()
})

onUnmounted(() => {
  if (loginRedirectTimer) clearTimeout(loginRedirectTimer)
})

const monthlyConfigured = computed(() => !!getPriceIdForChoice('monthly'))
const yearlyConfigured = computed(() => !!getPriceIdForChoice('yearly'))

const proPriceDisplay = computed(() => {
  if (mvpPromoTrialEnabled.value && billingCycleChoice.value === 'yearly') return 'Coming soon'
  const m = String(config.public.billingProMonthlyLabel || '$1.99/mo')
  const y = String(config.public.billingProYearlyLabel || '$15.99/yr')
  return billingCycleChoice.value === 'monthly' ? m : y
})

const checkoutDisabled = computed(() => {
  if (actionLoading.value) return true
  if (mvpPromoTrialEnabled.value) {
    if (billingCycleChoice.value === 'yearly') return true
    return false
  }
  return billingCycleChoice.value === 'monthly' ? !monthlyConfigured.value : !yearlyConfigured.value
})

const primaryCtaLabel = computed(() => {
  if (mvpPromoTrialEnabled.value && billingCycleChoice.value === 'monthly') {
    return actionLoading.value ? 'Activating…' : 'Activate free trial'
  }
  return actionLoading.value ? 'Opening…' : 'Continue to checkout'
})

useHead({ title: 'Billing | Link by Code' })
</script>

<template>
  <div class="space-y-6">
    <section
      v-if="!accessToken"
      class="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900"
    >
      <p class="text-sm font-medium text-neutral-900 dark:text-white">Sign in required</p>
      <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Sign in to view billing and transactions.
      </p>
      <button
        type="button"
        class="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        @click="goLogin"
      >
        Sign in
      </button>
    </section>

    <p
      v-if="accessToken && billingUiReady && mvpPromoTrialEnabled && billingPageSubscription?.plan === 'free'"
      class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100"
    >
      🎉 Free 1-month Pro trial — activate below with no card
      <span v-if="promoWindowEndsLabel"> (campaign through {{ promoWindowEndsLabel }})</span>.
      Paid <strong class="font-semibold">monthly</strong> or <strong class="font-semibold">yearly</strong> with Stripe unlocks after your free month ends (yearly checkout also opens after the campaign window ends).
    </p>

    <p
      v-if="accessToken && billingUiReady && mvpPromoTrialFlag && !isPromoWindowOpen && billingPageSubscription?.plan === 'free'"
      class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-500/35 dark:bg-amber-500/10 dark:text-amber-100"
    >
      The introductory free campaign has ended<span v-if="promoWindowEndsLabel"> (closed {{ promoWindowEndsLabel }})</span>.
      Subscribe to Pro with Stripe — monthly or yearly below.
    </p>

    <p
      v-if="accessToken && checkoutError"
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
    >
      {{ checkoutError }}
    </p>

    <div
      v-if="accessToken && !billingUiReady"
      class="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start"
      aria-hidden="true"
    >
      <div class="h-72 animate-pulse rounded-2xl bg-neutral-200/90 dark:bg-neutral-800" />
      <div class="h-96 animate-pulse rounded-2xl bg-neutral-200/90 dark:bg-neutral-800" />
    </div>

    <div
      v-if="accessToken && billingUiReady && billingPageSubscription?.plan === 'free'"
      class="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start"
    >
      <PricingCard
        title="Free"
        price="$0"
        description="Your current plan"
        :features="freeFeatures"
      />

      <PricingCard
        title="Pro"
        :price="proPriceDisplay"
        :description="mvpPromoTrialEnabled
          ? 'Free Pro activation on monthly during the campaign · Paid monthly/yearly after your free month (or yearly checkout when enabled)'
          : mvpPromoTrialFlag
            ? 'Campaign window ended — pay monthly or yearly with Stripe'
            : 'Price depends on billing period · Pay securely with Stripe'"
        :features="proFeatures"
        featured
      >
        <template #footer>
          <p class="mb-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Billing period
          </p>
          <div
            class="flex w-full rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 dark:border-white/10 dark:bg-neutral-950/80"
            role="group"
            aria-label="Billing period"
          >
            <button
              type="button"
              class="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-md px-2 py-2 text-sm font-medium transition-colors sm:flex-row sm:gap-1"
              :class="billingCycleChoice === 'monthly'
                ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white'
                : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'"
              @click="billingCycleChoice = 'monthly'"
            >
              <span>Monthly</span>
              <span v-if="mvpPromoTrialEnabled" class="text-[10px] font-normal text-emerald-600 dark:text-emerald-400">Trial</span>
            </button>
            <button
              type="button"
              class="relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-md px-2 py-2 text-sm font-medium transition-colors sm:flex-row sm:gap-1"
              :class="billingCycleChoice === 'yearly'
                ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white'
                : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'"
              @click="billingCycleChoice = 'yearly'"
            >
              <span>Yearly</span>
              <span
                v-if="mvpPromoTrialEnabled"
                class="text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300"
              >Soon</span>
            </button>
          </div>
          <p
            v-if="mvpPromoTrialEnabled && billingCycleChoice === 'yearly'"
            class="mt-2 text-xs text-amber-700 dark:text-amber-300"
          >
            During the free campaign, yearly paid checkout opens after the campaign window ends — use Monthly for the free trial, or wait to pay yearly.
          </p>
          <p
            v-if="mvpPromoTrialEnabled && billingCycleChoice === 'monthly'"
            class="mt-2 text-xs text-neutral-600 dark:text-neutral-400"
          >
            After the free month ends, you can move to paid monthly or yearly billing in Stripe.
          </p>
          <p
            v-else-if="!mvpPromoTrialEnabled && ((billingCycleChoice === 'monthly' && !monthlyConfigured) || (billingCycleChoice === 'yearly' && !yearlyConfigured))"
            class="mt-2 text-xs text-red-600 dark:text-red-400"
          >
            {{ billingCycleChoice === 'monthly' ? 'Monthly Stripe price ID is not set in env.' : 'Yearly Stripe price ID is not set in env.' }}
          </p>
          <button
            type="button"
            class="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="checkoutDisabled"
            @click="startProCheckout"
          >
            {{ primaryCtaLabel }}
          </button>
        </template>
      </PricingCard>
    </div>

    <section v-if="accessToken && billingUiReady && billingPageSubscription?.plan === 'pro'">
      <BillingPlanCard
        :subscription="billingPageSubscription"
        :loading="actionLoading"
        :action-label="actionLabel"
        @action="handleAction"
      />
    </section>

    <section v-if="accessToken">
      <PaymentHistoryTable :payments="payments" :loading="transactionsLoading" />
    </section>
  </div>
</template>
