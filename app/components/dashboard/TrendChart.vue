<script setup lang="ts">
const props = defineProps<{ labels: string[]; values: number[] }>()

const points = computed(() => {
  const max = Math.max(...props.values, 1)
  return props.values.map((value, idx) => {
    const x = (idx / Math.max(props.values.length - 1, 1)) * 100
    const y = 100 - (value / max) * 100
    return `${x},${y}`
  }).join(' ')
})
</script>

<template>
  <div class="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900">
    <h3 class="text-sm font-semibold text-neutral-900 dark:text-white">Clicks Trend (7 days)</h3>
    <svg viewBox="0 0 100 100" class="mt-4 h-44 w-full overflow-visible">
      <polyline points="0,100 100,100" fill="none" stroke="#d4d4d8" stroke-width="0.8" />
      <polyline :points="points" fill="none" stroke="#6366f1" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="line-path" />
    </svg>
    <div class="mt-2 grid grid-cols-7 gap-1 text-center text-[10px] text-neutral-500 dark:text-neutral-400">
      <span v-for="label in props.labels" :key="label">{{ label }}</span>
    </div>
  </div>
</template>

<style scoped>
.line-path {
  stroke-dasharray: 400;
  stroke-dashoffset: 400;
  animation: draw-line .8s ease-out forwards;
}
@keyframes draw-line { to { stroke-dashoffset: 0; } }
</style>
