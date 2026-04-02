<script setup lang="ts">
import { Chart, registerables } from 'chart.js'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useDashboardTheme } from '~/composables/useDashboardTheme'

const props = defineProps<{ items: Array<{ label: string; value: number; fullLabel?: string }> }>()
const { isDark } = useDashboardTheme()
const chartRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

Chart.register(...registerables)

const truncateLabel = (value: string, max = 14) => {
  if (value.length <= max) return value
  return `${value.slice(0, max - 1)}…`
}

const renderChart = () => {
  if (!chartRef.value) return
  chart?.destroy()
  const textColor = isDark.value ? '#d4d4d8' : '#52525b'
  const gridColor = isDark.value ? 'rgba(255,255,255,0.08)' : 'rgba(39,39,42,0.08)'
  chart = new Chart(chartRef.value, {
    type: 'bar',
    data: { labels: props.items.map(item => item.label), datasets: [{ data: props.items.map(item => item.value), borderRadius: 8, backgroundColor: '#6366f1', maxBarThickness: 22 }] },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 700, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => {
              const idx = items?.[0]?.dataIndex ?? -1
              if (idx < 0) return ''
              return props.items[idx]?.fullLabel || props.items[idx]?.label || ''
            },
            label: (item) => `${item.raw} clicks`
          }
        }
      },
      scales: {
        x: { ticks: { color: textColor, font: { size: 10 } }, grid: { color: gridColor }, beginAtZero: true },
        y: {
          ticks: {
            color: textColor,
            font: { size: 10 },
            callback: (_value, index) => truncateLabel(props.items[index]?.label || '')
          },
          grid: { display: false }
        }
      }
    }
  })
}

onMounted(renderChart)
onBeforeUnmount(() => chart?.destroy())
watch([() => props.items, () => isDark.value], renderChart, { deep: true })
</script>

<template>
  <div class="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900">
    <h3 class="text-sm font-semibold text-neutral-900 dark:text-white">Top Links by Clicks</h3>
    <div class="mt-4 h-52">
      <canvas ref="chartRef" />
    </div>
  </div>
</template>
