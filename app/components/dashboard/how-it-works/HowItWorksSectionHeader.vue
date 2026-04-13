<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <header class="border-b border-neutral-200 pb-4 dark:border-white/10">
    <h2 class="text-xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
      {{ title }}
    </h2>
    <p class="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
      {{ description }}
    </p>
  </header>
</template>
