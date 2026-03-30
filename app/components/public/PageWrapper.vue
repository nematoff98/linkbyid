<script setup lang="ts">
defineProps<{
  isDark?: boolean
}>()
</script>

<template>
  <div
    :class="{ dark: isDark }"
    class="min-h-screen bg-neutral-100 px-4 py-5 text-neutral-900 selection:bg-indigo-300/35 sm:px-6 sm:py-9 dark:bg-neutral-950 dark:text-neutral-100 dark:selection:bg-indigo-500/30"
  >
    <div class="pointer-events-none absolute inset-x-0 top-0 h-[260px] bg-gradient-to-b from-indigo-100/70 to-transparent dark:from-indigo-500/10" />

    <div class="relative mx-auto w-full max-w-2xl">
      <div class="overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white p-4 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.35)] sm:p-8 md:p-9 dark:border-white/10 dark:bg-neutral-900 dark:shadow-[0_22px_55px_-34px_rgba(79,70,229,0.65)]">
        <slot />
      </div>
    </div>
  </div>
</template>
