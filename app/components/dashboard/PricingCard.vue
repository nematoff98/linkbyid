<script setup lang="ts">
const props = defineProps<{
  title: string
  price: string
  description: string
  features: string[]
  featured?: boolean
}>()
</script>

<template>
  <div class="rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:shadow-md" :class="props.featured ? 'border-indigo-300 bg-indigo-50/40 dark:border-indigo-500/40 dark:bg-indigo-500/10' : 'border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900'">
    <h3 class="text-base font-semibold text-neutral-900 dark:text-white">{{ props.title }}</h3>
    <p class="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">{{ props.price }}</p>
    <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{{ props.description }}</p>
    <ul class="mt-4 space-y-2 text-sm text-neutral-700 dark:text-neutral-200">
      <li v-for="feature in props.features" :key="feature">• {{ feature }}</li>
    </ul>
  </div>
</template>
