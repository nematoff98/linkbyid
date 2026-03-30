<script setup lang="ts">
import { ArrowDown, Menu, Moon, Setting, Sunny, SwitchButton, UserFilled } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardData } from '~/composables/useDashboardData'
import { useDashboardTheme } from '~/composables/useDashboardTheme'

const props = defineProps<{ title: string }>()
const emit = defineEmits<{ (e: 'toggle-sidebar'): void }>()
const router = useRouter()
const avatarError = ref(false)
const { profile } = useDashboardData()
const { isDark, toggleTheme } = useDashboardTheme()
const hasAvatar = computed(() => Boolean(profile.value.avatar?.trim()) && !avatarError.value)

const onCommand = (command: string | number | object) => {
  if (command === 'settings') router.push('/dashboard/profile')
}
</script>

<template>
  <header class="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4 dark:border-white/10 dark:bg-neutral-900">
    <div class="flex items-center gap-2">
      <button class="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 md:hidden dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-200" @click="emit('toggle-sidebar')">
        <el-icon><Menu /></el-icon>
      </button>
      <h1 class="text-lg font-semibold text-neutral-900 md:text-xl dark:text-white">{{ props.title }}</h1>
    </div>
    <div class="relative flex items-center gap-2">
      <button
        class="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 transition-all duration-200 hover:shadow-md dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-200"
        @click="toggleTheme"
      >
        <el-icon><Moon v-if="isDark" /><Sunny v-else /></el-icon>
      </button>
      <ClientOnly>
        <el-dropdown trigger="click" @command="onCommand">
          <button class="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-2 py-1.5 transition-all duration-200 hover:shadow-md dark:border-white/10 dark:bg-neutral-800">
            <img v-if="hasAvatar" :src="profile.avatar" alt="User avatar" class="h-8 w-8 rounded-full object-cover" @error="avatarError = true">
            <span v-else class="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-200"><el-icon><UserFilled /></el-icon></span>
            <span class="hidden text-sm text-neutral-700 sm:inline dark:text-neutral-200">Account</span>
            <el-icon><ArrowDown /></el-icon>
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="settings"><span class="flex items-center gap-2"><el-icon><Setting /></el-icon>Settings</span></el-dropdown-item>
              <el-dropdown-item command="logout"><span class="flex items-center gap-2 text-red-600"><el-icon><SwitchButton /></el-icon>Logout</span></el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </ClientOnly>
    </div>
  </header>
</template>
