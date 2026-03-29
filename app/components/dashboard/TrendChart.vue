<script setup lang="ts">
import { Chart, registerables } from 'chart.js'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useDashboardTheme } from '~/composables/useDashboardTheme'

const props = defineProps<{ labels: string[]; values: number[] }>()
const { isDark } = useDashboardTheme()
const chartRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

Chart.register(...registerables)

const renderChart = () => {
  if (!chartRef.value) return
  chart?.destroy()
  const textColor = isDark.value ? '#d4d4d8' : '#52525b'
  const gridColor = isDark.value ? 'rgba(255,255,255,0.08)' : 'rgba(39,39,42,0.08)'
  chart = new Chart(chartRef.value, {
    type: 'line',
    data: { labels: props.labels, datasets: [{ data: props.values, borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.15)', fill: true, tension: 0.35, pointRadius: 3, pointHoverRadius: 5 }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 800, easing: 'easeOutQuart' },
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: textColor, font: { size: 10 } }, grid: { color: gridColor } },
        y: { ticks: { color: textColor, font: { size: 10 } }, grid: { color: gridColor }, beginAtZero: true }
      }
    }
  })
}

onMounted(renderChart)
onBeforeUnmount(() => chart?.destroy())
watch([() => props.values, () => isDark.value], renderChart, { deep: true })
</script>

<template>
  <div class="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900">
    <h3 class="text-sm font-semibold text-neutral-900 dark:text-white">Clicks Trend (7 days)</h3>
    <div class="mt-4 h-52">
      <canvas ref="chartRef" />
    </div>
  </div>
</template>
