<script setup lang="ts">
import BillingPlanCard from '~/components/dashboard/BillingPlanCard.vue'
import PaymentHistoryTable from '~/components/dashboard/PaymentHistoryTable.vue'
import PricingCard from '~/components/dashboard/PricingCard.vue'

definePageMeta({ layout: 'dashboard' })

const {
  subscription,
  payments,
  actionLoading,
  subscriptionLoading,
  transactionsLoading,
  actionLabel,
  billingCycleChoice,
  checkoutError,
  getPriceIdForChoice,
  startProCheckout,
  openBillingPortal
} = useBillingData()

const { accessToken } = useAuthSession()
const config = useRuntimeConfig()

const freeFeatures = ['Up to 10 links', 'Simple profile', 'Support']
const proFeatures = ['Unlimited links', 'Analytics', 'Theme', 'Faster loading']

const handleAction = () => {
  openBillingPortal()
}

const goLogin = () => navigateTo({ path: '/login', query: { redirect: '/dashboard/billing' } })

let loginRedirectTimer: ReturnType<typeof setTimeout> | null = null
onMounted(() => {
  if (!accessToken.value) {
    loginRedirectTimer = setTimeout(() => {
      navigateTo({ path: '/login', query: { redirect: '/dashboard/billing' } })
    }, 2800)
  }
})

onUnmounted(() => {
  if (loginRedirectTimer) clearTimeout(loginRedirectTimer)
})

const monthlyConfigured = computed(() => !!getPriceIdForChoice('monthly'))
const yearlyConfigured = computed(() => !!getPriceIdForChoice('yearly'))

const proPriceDisplay = computed(() => {
  const m = String(config.public.billingProMonthlyLabel || '$1.99/mo')
  const y = String(config.public.billingProYearlyLabel || '$15.99/yr')
  return billingCycleChoice.value === 'monthly' ? m : y
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
      v-if="accessToken && checkoutError"
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
    >
      {{ checkoutError }}
    </p>

    <div
      v-if="accessToken && subscriptionLoading"
      class="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start"
      aria-hidden="true"
    >
      <div class="h-72 animate-pulse rounded-2xl bg-neutral-200/90 dark:bg-neutral-800" />
      <div class="h-96 animate-pulse rounded-2xl bg-neutral-200/90 dark:bg-neutral-800" />
    </div>

    <div
      v-if="accessToken && !subscriptionLoading && subscription.plan === 'free'"
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
        description="Price depends on billing period · Pay securely with Stripe"
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
              class="flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors"
              :class="billingCycleChoice === 'monthly'
                ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white'
                : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'"
              @click="billingCycleChoice = 'monthly'"
            >
              Monthly
            </button>
            <button
              type="button"
              class="flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors"
              :class="billingCycleChoice === 'yearly'
                ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white'
                : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'"
              @click="billingCycleChoice = 'yearly'"
            >
              Yearly
            </button>
          </div>
          <p
            v-if="(billingCycleChoice === 'monthly' && !monthlyConfigured) || (billingCycleChoice === 'yearly' && !yearlyConfigured)"
            class="mt-2 text-xs text-red-600 dark:text-red-400"
          >
            {{ billingCycleChoice === 'monthly' ? 'Monthly Stripe price ID is not set in env.' : 'Yearly Stripe price ID is not set in env.' }}
          </p>
          <button
            type="button"
            class="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="actionLoading || (billingCycleChoice === 'monthly' ? !monthlyConfigured : !yearlyConfigured)"
            @click="startProCheckout"
          >
            {{ actionLoading ? 'Opening…' : 'Continue to checkout' }}
          </button>
        </template>
      </PricingCard>
    </div>

    <section v-if="accessToken && !subscriptionLoading && subscription.plan === 'pro'">
      <BillingPlanCard
        :subscription="subscription"
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
