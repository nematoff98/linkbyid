<script setup lang="ts">
import type { BillingSubscription } from '~/types/billing'

const props = defineProps<{ subscription: BillingSubscription; loading?: boolean; actionLabel: string }>()
const emit = defineEmits<{ (e: 'action'): void; (e: 'cancel'): void }>()
</script>

<template>
  <section class="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900">
    <div class="flex items-center justify-between">
      <h2 class="text-base font-semibold text-neutral-900 dark:text-white">Current Plan</h2>
      <span class="rounded-lg bg-indigo-50 px-2 py-1 text-xs font-semibold uppercase text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
        {{ props.subscription.plan }}
      </span>
    </div>
    <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{{ props.subscription.priceLabel }}</p>
    <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
      Expiry: {{ props.subscription.expiryDate || 'No expiry for free plan' }}
    </p>
    <div class="mt-4 flex flex-wrap gap-2">
      <button class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500" :disabled="props.loading" @click="emit('action')">
        {{ props.loading ? 'Redirecting...' : props.actionLabel }}
      </button>
      <button
        v-if="props.subscription.plan === 'pro'"
        class="rounded-xl border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:border-red-400/30 dark:hover:bg-red-500/10"
        @click="emit('cancel')"
      >
        Cancel subscription
      </button>
    </div>
  </section>
</template>
