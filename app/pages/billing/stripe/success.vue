<script setup lang="ts">
definePageMeta({ layout: false })

useHead({ title: 'Payment successful | Link by Code' })

const { refreshSubscription, subscription, subscriptionLoading } = useBillingData()

let refreshTimer: ReturnType<typeof setTimeout> | null = null

function formatCycle(raw: string | null | undefined) {
  const c = (raw || '').toLowerCase()
  if (c === 'yearly' || c === 'annual' || c === 'year') return 'Yearly'
  if (c === 'monthly' || c === 'month') return 'Monthly'
  return raw || ''
}

onMounted(() => {
  refreshTimer = setTimeout(() => {
    refreshSubscription()
  }, 2000)
})

onUnmounted(() => {
  if (refreshTimer) clearTimeout(refreshTimer)
})
</script>

<template>
  <div class="min-h-screen bg-neutral-100 px-4 py-16 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
    <div class="mx-auto max-w-lg rounded-2xl border border-emerald-200 bg-white p-8 shadow-sm dark:border-emerald-500/30 dark:bg-neutral-900">
      <p class="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Stripe</p>
      <h1 class="mt-2 text-2xl font-bold">Payment successful</h1>
      <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Thank you! Your subscription is updating. Details will refresh in a few seconds.
      </p>

      <div v-if="subscriptionLoading" class="mt-4 text-sm text-neutral-500">Loading…</div>
      <div v-else-if="subscription.plan !== 'free'" class="mt-4 rounded-xl bg-neutral-50 p-3 text-sm dark:bg-white/5">
        <p><span class="text-neutral-500">Plan:</span> {{ subscription.plan }}</p>
        <p class="mt-1"><span class="text-neutral-500">Status:</span> {{ subscription.status }}</p>
        <p v-if="subscription.billingCycle" class="mt-1"><span class="text-neutral-500">Billing cycle:</span> {{ formatCycle(subscription.billingCycle) }}</p>
      </div>

      <div class="mt-6 flex flex-wrap gap-3">
        <NuxtLink
          to="/dashboard/billing"
          class="inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Back to billing
        </NuxtLink>
        <NuxtLink
          to="/dashboard/statistics"
          class="inline-flex rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 dark:border-white/15 dark:text-neutral-100 dark:hover:bg-white/5"
        >
          Dashboard
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
