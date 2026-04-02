<script setup lang="ts">
import type { BillingSubscription } from '~/types/billing'

const props = withDefaults(
  defineProps<{
    subscription: BillingSubscription
    loading?: boolean
    actionLabel: string
    showPrimaryAction?: boolean
  }>(),
  { showPrimaryAction: true }
)
const emit = defineEmits<{ (e: 'action'): void }>()

function formatBillingCycle(raw: string | null | undefined): string | null {
  const c = (raw || '').toLowerCase()
  if (c === 'yearly' || c === 'annual' || c === 'year') return 'Yearly'
  if (c === 'monthly' || c === 'month') return 'Monthly'
  return raw ? String(raw) : null
}

const metaLine = computed(() => {
  const s = props.subscription
  if (s.plan === 'pro') {
    const parts: string[] = []
    const cycle = formatBillingCycle(s.billingCycle)
    if (cycle) parts.push(cycle)
    if (s.expiryDate) parts.push(`Renews ${s.expiryDate}`)
    return parts.length ? parts.join(' · ') : null
  }
  if (s.plan === 'free') return 'No limits on the Free plan'
  return null
})
</script>

<template>
  <section class="rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-neutral-900">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <h2 class="text-sm font-semibold text-neutral-900 dark:text-white">Current plan</h2>
          <span class="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-500/25 dark:text-indigo-200">
            {{ subscription.plan }}
          </span>
        </div>
        <p class="mt-1 text-sm font-medium text-neutral-800 dark:text-neutral-100">
          {{ subscription.priceLabel }}
        </p>
        <p v-if="metaLine" class="mt-0.5 text-xs leading-snug text-neutral-500 dark:text-neutral-400">
          {{ metaLine }}
        </p>
      </div>
      <div v-if="showPrimaryAction" class="shrink-0 sm:ml-2">
        <button
          class="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 sm:w-auto"
          :disabled="loading"
          @click="emit('action')"
        >
          {{ loading ? 'Redirecting…' : actionLabel }}
        </button>
      </div>
    </div>
  </section>
</template>
