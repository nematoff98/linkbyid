<script setup lang="ts">
import type { BillingPayment } from '~/types/billing'

const props = defineProps<{ payments: BillingPayment[] }>()
</script>

<template>
  <section class="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900">
    <h2 class="text-base font-semibold text-neutral-900 dark:text-white">Payment History</h2>
    <div v-if="props.payments.length === 0" class="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
      No payments yet.
    </div>
    <div v-else class="mt-3 overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="text-left text-neutral-500 dark:text-neutral-400">
            <th class="py-2">Date</th><th class="py-2">Plan</th><th class="py-2">Amount</th><th class="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="payment in props.payments" :key="payment.id" class="border-t border-neutral-200 dark:border-white/10">
            <td class="py-2">{{ payment.date }}</td>
            <td class="py-2">{{ payment.plan }}</td>
            <td class="py-2">{{ payment.amount }}</td>
            <td class="py-2">
              <span class="rounded-md px-2 py-1 text-xs" :class="payment.status === 'paid' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200' : 'bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-200'">
                {{ payment.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
