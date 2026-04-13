<script setup lang="ts">
import { DataAnalysis, Link, Reading, Setting, Tickets, User } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useBillingData } from '~/composables/useBillingData'
import { useDashboardTheme } from '~/composables/useDashboardTheme'

const route = useRoute()
const { isDark } = useDashboardTheme()
const { subscription } = useBillingData()
const { navReady } = useDashboardNavReady()

const showProNav = computed(() => subscription.value.plan === 'pro')

const activeMenuPath = computed(() => {
  const p = route.path
  if (p.startsWith('/dashboard/tickets')) return '/dashboard/tickets'
  return p
})

const allNavItems = [
  { label: 'Statistics', to: '/dashboard/statistics', icon: DataAnalysis, proOnly: true },
  { label: 'Profile', to: '/dashboard/profile', icon: User, proOnly: false },
  { label: 'How it works', to: '/dashboard/how-it-works', icon: Reading, proOnly: false },
  { label: 'Links', to: '/dashboard/links', icon: Link, proOnly: false },
  { label: 'Billing', to: '/dashboard/billing', icon: Setting, proOnly: false },
  { label: 'Tickets', to: '/dashboard/tickets', icon: Tickets, proOnly: true }
] as const

const items = computed(() => {
  if (showProNav.value) return [...allNavItems]
  return allNavItems.filter(i => !i.proOnly)
})

/** Remount menu when route or visible items change so `default-active` re-applies (el-menu quirk). */
const menuRemountKey = computed(
  () => `${route.fullPath}::${activeMenuPath.value}::${navReady.value}::${items.value.map(i => i.to).join('|')}`
)

const onMenuSelect = (index: string) => {
  if (index && index !== route.path) void navigateTo(index)
}

const menuStyle = computed(() => isDark.value ? {
  '--el-menu-bg-color': 'transparent',
  '--el-menu-text-color': 'rgb(212 212 216)',
  '--el-menu-hover-bg-color': 'rgba(255,255,255,0.06)',
  '--el-menu-active-color': 'rgb(165 180 252)'
} : {
  '--el-menu-bg-color': 'transparent',
  '--el-menu-text-color': 'rgb(82 82 91)',
  '--el-menu-hover-bg-color': 'rgba(99,102,241,0.08)',
  '--el-menu-active-color': 'rgb(67 56 202)'
})
</script>

<template>
  <aside class="h-full bg-white p-4 dark:bg-neutral-900">
    <div class="mb-6 px-2">
      <p class="text-lg font-bold text-neutral-900 dark:text-white">LinkByCode</p>
      <p class="text-xs text-neutral-500 dark:text-neutral-400">SaaS Dashboard</p>
    </div>
    <el-menu
      v-if="navReady"
      :key="menuRemountKey"
      :default-active="activeMenuPath"
      class="dashboard-menu !border-none bg-transparent"
      :style="menuStyle"
      @select="onMenuSelect"
    >
      <el-menu-item
        v-for="item in items"
        :key="item.to"
        :index="item.to"
        class="rounded-xl"
      >
        <el-icon><component :is="item.icon" /></el-icon>
        <span>{{ item.label }}</span>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<style scoped>
:deep(.dashboard-menu .el-menu-item) {
  height: 40px;
}
:deep(.dashboard-menu .el-menu-item.is-active) {
  color: rgb(83, 70, 241);
}

:deep(.dark .dashboard-menu .el-menu-item.is-active) {
  color: rgb(199 210 254);
}
</style>
