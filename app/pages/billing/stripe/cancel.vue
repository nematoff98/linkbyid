<script setup lang="ts">
definePageMeta({ layout: false })

useHead({ title: 'Payment canceled | Link by Code' })
</script>

<template>
  <div class="min-h-screen bg-neutral-100 px-4 py-16 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
    <div class="mx-auto max-w-lg rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-neutral-900">
      <p class="text-sm font-semibold uppercase tracking-wide text-neutral-500">Stripe</p>
      <h1 class="mt-2 text-2xl font-bold">Payment canceled</h1>
      <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Checkout was closed or the payment did not complete. You can try again anytime.
      </p>
      <div class="mt-6 flex flex-wrap gap-3">
        <NuxtLink
          to="/dashboard/billing"
          class="inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Back to billing
        </NuxtLink>
        <NuxtLink
          to="/"
          class="inline-flex rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50 dark:border-white/15 dark:text-neutral-100 dark:hover:bg-white/5"
        >
          Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
