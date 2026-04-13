<script setup lang="ts">
import { WarningFilled } from '@element-plus/icons-vue'

defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <article
    class="rounded-2xl border border-amber-200/90 bg-amber-50/80 p-5 shadow-sm dark:border-amber-500/35 dark:bg-amber-950/35 sm:p-6"
    role="status"
  >
    <div class="flex gap-3 sm:gap-4">
      <span
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
        aria-hidden="true"
      >
        <el-icon class="text-xl"><WarningFilled /></el-icon>
      </span>
      <div class="min-w-0 flex-1">
        <h3 class="text-base font-semibold text-amber-950 dark:text-amber-100">
          {{ title }}
        </h3>
        <p class="mt-2 text-sm leading-relaxed text-amber-950/85 dark:text-amber-50/90">
          {{ description }}
        </p>
      </div>
    </div>
  </article>
</template>
