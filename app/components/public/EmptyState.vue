<script setup lang="ts">
defineProps<{
  title: string
  message: string
}>()
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 p-7 text-center dark:border-white/12 dark:bg-neutral-900/70">
    <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-500 dark:border-amber-300/30 dark:bg-amber-400/12 dark:text-amber-200">
      <slot name="icon">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </slot>
    </div>
    <h3 class="mb-1.5 text-base font-bold text-neutral-900 dark:text-white">{{ title }}</h3>
    <p class="max-w-[320px] text-[14px] leading-relaxed text-neutral-600 dark:text-neutral-300">{{ message }}</p>
  </div>
</template>
