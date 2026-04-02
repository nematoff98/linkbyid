<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ChatWidget from '~/components/dashboard/ChatWidget.vue'
import Sidebar from '~/components/dashboard/Sidebar.vue'
import Topbar from '~/components/dashboard/Topbar.vue'
import { useDashboardData } from '~/composables/useDashboardData'
import { useDashboardTheme } from '~/composables/useDashboardTheme'

const route = useRoute()
const { isDark } = useDashboardTheme()
const { loadMyProfile } = useDashboardData()
const mobileMenuOpen = ref(false)

const pageTitle = computed(() => {
  if (route.path.startsWith('/dashboard/profile')) return 'Profile Settings'
  if (route.path.startsWith('/dashboard/links')) return 'Manage Links'
  if (route.path.startsWith('/dashboard/billing')) return 'Billing'
  return 'Statistics'
})

watch(() => route.fullPath, () => {
  mobileMenuOpen.value = false
})

onMounted(() => {
  loadMyProfile().catch(() => {})
})
</script>

<template>
  <div :class="{ dark: isDark }" class="min-h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
    <el-container class="mx-auto min-h-screen w-full">
      <el-aside width="240px" class="dashboard-aside hidden md:block">
        <Sidebar />
      </el-aside>
      <el-container class="min-w-0">
        <el-header class="!h-auto !p-0">
          <Topbar :title="pageTitle" @toggle-sidebar="mobileMenuOpen = true" />
        </el-header>
        <el-main class="!p-0">
          <main class="px-4 py-4 sm:px-6 sm:py-6">
            <div class="mx-auto w-full max-w-5xl">
              <Transition name="dashboard-content" mode="out-in">
                <div :key="route.fullPath"><slot /></div>
              </Transition>
            </div>
          </main>
        </el-main>
      </el-container>
    </el-container>
    <el-drawer v-model="mobileMenuOpen" direction="ltr" size="240px" :with-header="false" class="dashboard-mobile-drawer md:!hidden">
      <Sidebar />
    </el-drawer>
    <ChatWidget />
  </div>
</template>

<style scoped>
.dashboard-aside { width: 240px !important; }
.dashboard-content-enter-active, .dashboard-content-leave-active { transition: opacity .24s ease, transform .24s ease; }
.dashboard-content-enter-from, .dashboard-content-leave-to { opacity: 0; transform: translateY(8px); }
:deep(.dashboard-mobile-drawer .el-drawer__body) {
  padding: 0;
  background: transparent;
}
:deep(.dashboard-mobile-drawer .el-drawer) {
  background: transparent;
}
</style>
