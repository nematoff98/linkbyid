<script setup lang="ts">
import StatCard from '~/components/dashboard/StatCard.vue'
import TopLinksChart from '~/components/dashboard/TopLinksChart.vue'
import TrendChart from '~/components/dashboard/TrendChart.vue'

definePageMeta({ layout: 'dashboard' })

const { links, totalClicks, recentLinks } = useDashboardData()

const trendLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const trendValues = computed(() => {
  const base = Math.max(totalClicks.value, 14)
  return trendLabels.map((_, idx) => Math.round((base / 7) * (0.6 + ((idx + 2) % 4) * 0.2)))
})

const topItems = computed(() => links.value
  .map(link => ({ label: link.title, value: link.clicks }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 5))
</script>

<template>
  <section class="grid grid-cols-1 gap-4 md:grid-cols-3">
    <StatCard label="Total Links" :value="links.length" helper="Managed product links" />
    <StatCard label="Total Clicks" :value="totalClicks" helper="All-time placeholder metric" />
    <StatCard label="Recent Links" :value="recentLinks.length" helper="Last 5 items" />
  </section>

  <section class="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
    <TrendChart :labels="trendLabels" :values="trendValues" />
    <TopLinksChart :items="topItems" />
  </section>

  <section class="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900">
    <h2 class="text-base font-semibold text-neutral-900 dark:text-white">Recent Links</h2>
    <ul class="mt-4 space-y-2">
      <li v-for="link in recentLinks" :key="link.id" class="flex items-center justify-between rounded-xl border border-neutral-200 p-3 dark:border-white/10">
        <div>
          <p class="text-sm font-medium text-neutral-900 dark:text-white">{{ link.title }}</p>
          <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ link.url }}</p>
        </div>
        <span class="rounded-lg bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">{{ link.code }}</span>
      </li>
    </ul>
  </section>
</template>
