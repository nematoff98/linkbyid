<script setup lang="ts">
import { DocumentCopy } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import StatCard from '~/components/dashboard/StatCard.vue'
import TopLinksChart from '~/components/dashboard/TopLinksChart.vue'
import TrendChart from '~/components/dashboard/TrendChart.vue'
import { dashboardService, type AnalyticsMeResponse } from '~/services/dashboard.service'
import { getApiErrorMessage } from '~/utils/apiError'

definePageMeta({ layout: 'dashboard', middleware: ['dashboard-pro'] })

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

const loadAnalytics = async () => {
  loading.value = true
  pageError.value = ''
  try {
    analytics.value = await dashboardService.getMyAnalytics()
  } catch (error) {
    pageError.value = getApiErrorMessage(error, 'Could not load analytics.')
  } finally {
    loading.value = false
  }
}

const copiedLinkId = ref<string | null>(null)
let copiedClearTimer: ReturnType<typeof setTimeout> | undefined

const copyLinkUrl = async (url: string, linkId: string) => {
  try {
    await navigator.clipboard.writeText(url)
    copiedLinkId.value = linkId
    if (copiedClearTimer) clearTimeout(copiedClearTimer)
    copiedClearTimer = setTimeout(() => {
      copiedLinkId.value = null
    }, 2000)
  } catch {
    pageError.value = 'Could not copy link. Check browser permissions.'
  }
}

onMounted(loadAnalytics)
</script>

<template>
  <p v-if="pageError" class="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">{{ pageError }}</p>
  <p v-if="loading" class="mb-4 text-sm text-neutral-500 dark:text-neutral-400">Loading analytics…</p>

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
      <li v-for="link in analytics.recent_links" :key="link.id" class="flex items-start justify-between gap-3 rounded-xl border border-neutral-200 p-3 dark:border-white/10">
        <div class="min-w-0 flex-1">
          <a
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="block text-sm font-medium text-neutral-900 hover:text-indigo-600 hover:underline dark:text-white dark:hover:text-indigo-400"
          >
            {{ link.title }}
          </a>
          <div class="mt-1 flex min-w-0 items-center gap-2">
            <a
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="min-w-0 flex-1 truncate text-xs text-neutral-500 hover:text-indigo-600 hover:underline dark:text-neutral-400 dark:hover:text-indigo-400"
              :title="link.url"
            >
              {{ link.url }}
            </a>
            <button
              type="button"
              class="inline-flex shrink-0 items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2 py-1 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-white/10"
              :aria-label="copiedLinkId === link.id ? 'Copied' : 'Copy link'"
              @click="copyLinkUrl(link.url, link.id)"
            >
              <el-icon class="text-sm"><DocumentCopy /></el-icon>
              <span>{{ copiedLinkId === link.id ? 'Copied' : 'Copy' }}</span>
            </button>
          </div>
        </div>
        <span class="shrink-0 rounded-lg bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">{{ link.clickCount }} clicks</span>
      </li>
      <li v-if="analytics.recent_links.length === 0" class="rounded-xl border border-dashed border-neutral-300 p-3 text-sm text-neutral-500 dark:border-white/20 dark:text-neutral-400">No popular links yet.</li>
    </ul>
  </section>
</template>
