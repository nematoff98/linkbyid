<script setup lang="ts">
import type { BillingPayment } from '~/types/billing'

const props = defineProps<{
  payments: BillingPayment[]
  loading?: boolean
}>()
</script>

<template>
  <section class="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900">
    <h2 class="text-base font-semibold text-neutral-900 dark:text-white">Transactions</h2>
    <p v-if="props.loading" class="mt-3 text-sm text-neutral-500 dark:text-neutral-400">Loading…</p>
    <div v-else-if="props.payments.length === 0" class="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
      No transactions yet.
    </div>
    <div v-else class="mt-3 overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="text-left text-neutral-500 dark:text-neutral-400">
            <th class="py-2 pr-4">Date</th>
            <th class="py-2 pr-4">Invoice</th>
            <th class="py-2 pr-4">Amount</th>
            <th class="py-2 pr-4">Status</th>
            <th class="py-2">Documents</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="payment in props.payments" :key="payment.id" class="border-t border-neutral-200 dark:border-white/10">
            <td class="py-2 pr-4 whitespace-nowrap">{{ payment.date }}</td>
            <td class="py-2 pr-4 font-mono text-xs">{{ payment.invoiceNumber }}</td>
            <td class="py-2 pr-4">{{ payment.amountLabel }}</td>
            <td class="py-2 pr-4">
              <span
                class="rounded-md px-2 py-1 text-xs capitalize"
                :class="payment.status === 'paid'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200'
                  : 'bg-neutral-100 text-neutral-700 dark:bg-white/10 dark:text-neutral-200'"
              >
                {{ payment.status }}
              </span>
            </td>
            <td class="py-2">
              <div class="flex flex-wrap gap-2">
                <a
                  v-if="payment.hostedInvoiceUrl"
                  :href="payment.hostedInvoiceUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-indigo-600 underline hover:text-indigo-500 dark:text-indigo-300"
                >
                  Invoice
                </a>
                <a
                  v-if="payment.invoicePdf"
                  :href="payment.invoicePdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-indigo-600 underline hover:text-indigo-500 dark:text-indigo-300"
                >
                  PDF
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
