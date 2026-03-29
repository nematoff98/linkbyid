<script setup lang="ts">
const props = defineProps<{
  label: string
  value: string | number
  helper?: string
}>()
</script>

<template>
  <div class="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md dark:border-white/10 dark:bg-neutral-900">
    <p class="text-sm text-neutral-500 dark:text-neutral-400">{{ props.label }}</p>
    <p class="mt-2 text-2xl font-semibold text-neutral-900 dark:text-white">{{ props.value }}</p>
    <p v-if="props.helper" class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{{ props.helper }}</p>
  </div>
</template>
