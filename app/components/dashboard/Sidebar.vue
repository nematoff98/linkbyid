<script setup lang="ts">
import { DataAnalysis, Link, Setting, User } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useDashboardTheme } from '~/composables/useDashboardTheme'

const route = useRoute()
const { isDark } = useDashboardTheme()
const items = [
  { label: 'Statistics', to: '/dashboard/statistics', icon: DataAnalysis },
  { label: 'Profile', to: '/dashboard/profile', icon: User },
  { label: 'Links', to: '/dashboard/links', icon: Link },
  { label: 'Billing', to: '/dashboard/billing', icon: Setting }
]

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
      :default-active="route.path"
      router
      class="dashboard-menu !border-none bg-transparent"
      :style="menuStyle"
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
