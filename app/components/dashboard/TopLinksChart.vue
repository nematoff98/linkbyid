<script setup lang="ts">
const props = defineProps<{ items: Array<{ label: string; value: number }> }>()
const max = computed(() => Math.max(...props.items.map(item => item.value), 1))
</script>

<template>
  <div class="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900">
    <h3 class="text-sm font-semibold text-neutral-900 dark:text-white">Top Links by Clicks</h3>
    <div class="mt-4 space-y-3">
      <div v-for="item in props.items" :key="item.label" class="space-y-1">
        <div class="flex items-center justify-between text-xs">
          <p class="truncate text-neutral-700 dark:text-neutral-200">{{ item.label }}</p>
          <p class="font-semibold text-neutral-700 dark:text-neutral-100">{{ item.value }}</p>
        </div>
        <div class="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
          <div class="h-full rounded-full bg-indigo-500 bar-fill" :style="{ width: `${(item.value / max) * 100}%` }" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bar-fill {
  transform-origin: left;
  animation: grow .6s ease-out;
}
@keyframes grow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
</style>
