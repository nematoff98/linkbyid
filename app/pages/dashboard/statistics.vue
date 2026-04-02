<script setup lang="ts">
import { onMounted, ref } from 'vue'
import StatCard from '~/components/dashboard/StatCard.vue'
import TopLinksChart from '~/components/dashboard/TopLinksChart.vue'
import TrendChart from '~/components/dashboard/TrendChart.vue'
import { dashboardService, type AnalyticsMeResponse } from '~/services/dashboard.service'

definePageMeta({ layout: 'dashboard' })

const analytics = ref<AnalyticsMeResponse>({
  summary: { links_count: 0, total_clicks: 0, page_views: 0 },
  clicks_last_7_days: [],
  top_links_by_clicks: [],
  recent_links: []
})
const loading = ref(false)
const pageError = ref('')

const trendLabels = computed(() => analytics.value.clicks_last_7_days.map((item) => {
  const d = new Date(item.date)
  return d.toLocaleDateString('en-US', { weekday: 'short' })
}))
const trendValues = computed(() => analytics.value.clicks_last_7_days.map(item => item.count))
const topItems = computed(() => analytics.value.top_links_by_clicks.slice(0, 7).map((link, idx) => ({
  label: link.code?.trim() || `#${idx + 1}`,
  fullLabel: link.title,
  value: link.clickCount
})))

const getApiErrorMessage = (error: unknown) => {
  const fallback = 'Analytics maʼlumotini olishda xatolik bo‘ldi.'
  if (!error || typeof error !== 'object') return fallback
  const data = (error as { data?: Record<string, unknown> }).data
  const nestedError = data?.error as Record<string, unknown> | undefined
  const nestedMessage = nestedError?.message
  if (Array.isArray(nestedMessage) && nestedMessage.length > 0) return nestedMessage.join(', ')
  if (typeof nestedMessage === 'string' && nestedMessage.trim()) return nestedMessage
  if (typeof data?.message === 'string') return data.message
  if (error instanceof Error) return error.message
  return fallback
}

const loadAnalytics = async () => {
  loading.value = true
  pageError.value = ''
  try {
    analytics.value = await dashboardService.getMyAnalytics()
  } catch (error) {
    pageError.value = getApiErrorMessage(error)
  } finally {
    loading.value = false
  }
}

onMounted(loadAnalytics)
</script>

<template>
  <p v-if="pageError" class="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">{{ pageError }}</p>
  <p v-if="loading" class="mb-4 text-sm text-neutral-500 dark:text-neutral-400">Analytics yuklanmoqda...</p>

  <section class="grid grid-cols-1 gap-4 md:grid-cols-3">
    <StatCard label="Total Links" :value="analytics.summary.links_count" helper="Managed product links" />
    <StatCard label="Total Clicks" :value="analytics.summary.total_clicks" helper="All links clicks" />
    <StatCard label="Page Views" :value="analytics.summary.page_views" helper="Profile page views" />
  </section>

  <section class="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
    <TrendChart :labels="trendLabels" :values="trendValues" />
    <TopLinksChart :items="topItems" />
  </section>

  <section class="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900">
    <h2 class="text-base font-semibold text-neutral-900 dark:text-white">Most Popular</h2>
    <ul class="mt-4 space-y-2">
      <li v-for="link in analytics.recent_links" :key="link.id" class="flex items-center justify-between rounded-xl border border-neutral-200 p-3 dark:border-white/10">
        <div>
          <p class="text-sm font-medium text-neutral-900 dark:text-white">{{ link.title }}</p>
          <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ link.url }}</p>
        </div>
        <span class="rounded-lg bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">{{ link.clickCount }} clicks</span>
      </li>
      <li v-if="analytics.recent_links.length === 0" class="rounded-xl border border-dashed border-neutral-300 p-3 text-sm text-neutral-500 dark:border-white/20 dark:text-neutral-400">Most popular links mavjud emas.</li>
    </ul>
  </section>
</template>
