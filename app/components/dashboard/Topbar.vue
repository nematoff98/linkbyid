<script setup lang="ts">
import { ArrowDown, Setting, SwitchButton, UserFilled } from '@element-plus/icons-vue'

const props = defineProps<{ title: string }>()
const handleBack = () => {}
const openMenu = ref(false)
const avatarError = ref(false)
const { profile } = useDashboardData()
const hasAvatar = computed(() => Boolean(profile.value.avatar?.trim()) && !avatarError.value)
</script>

<template>
  <header class="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4 dark:border-white/10 dark:bg-neutral-900">
    <el-page-header :icon="null" class="dashboard-page-header" @back="handleBack">
      <template #content>
        <span class="text-xl font-semibold text-neutral-900 dark:text-white">{{ props.title }}</span>
      </template>
    </el-page-header>
    <div class="relative">
      <button
        class="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-2 py-1.5 transition-all duration-200 hover:shadow-md dark:border-white/10 dark:bg-neutral-800"
        @click="openMenu = !openMenu"
      >
        <img
          v-if="hasAvatar"
          :src="profile.avatar"
          alt="User avatar"
          class="h-8 w-8 rounded-full object-cover"
          @error="avatarError = true"
        >
        <span v-else class="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-200">
          <el-icon><UserFilled /></el-icon>
        </span>
        <span class="text-sm text-neutral-700 dark:text-neutral-200">Account</span>
        <el-icon><ArrowDown /></el-icon>
      </button>
      <div v-if="openMenu" class="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-neutral-200 bg-white p-1 shadow-md dark:border-white/10 dark:bg-neutral-800">
        <NuxtLink to="/dashboard/profile" class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-white/10" @click="openMenu = false">
          <el-icon><Setting /></el-icon>Settings
        </NuxtLink>
        <button class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10" @click="openMenu = false">
          <el-icon><SwitchButton /></el-icon>Logout
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
:deep(.dashboard-page-header .el-page-header__left) {
  display: none;
}
</style>
