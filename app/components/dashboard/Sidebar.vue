<script setup lang="ts">
import { DataAnalysis, Link, User } from '@element-plus/icons-vue'

const route = useRoute()
const items = [
  { label: 'Statistics', to: '/dashboard/statistics', icon: DataAnalysis },
  { label: 'Profile', to: '/dashboard/profile', icon: User },
  { label: 'Links', to: '/dashboard/links', icon: Link }
]
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
:deep(.dashboard-menu .el-menu-item.is-active) {
  background-color: rgb(238 242 255);
  color: rgb(67 56 202);
}
</style>
