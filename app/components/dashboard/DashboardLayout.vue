<script setup lang="ts">
import Sidebar from '~/components/dashboard/Sidebar.vue'
import Topbar from '~/components/dashboard/Topbar.vue'

const props = defineProps<{ title: string }>()
</script>

<template>
  <div class="min-h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
    <el-container class="mx-auto min-h-screen w-full">
      <el-aside width="240px" class="dashboard-aside">
        <Sidebar />
      </el-aside>
      <el-container class="min-w-0">
        <el-header class="!h-auto !p-0">
          <Topbar :title="props.title" />
        </el-header>
        <el-main class="!p-0">
          <main class="px-6 py-6">
            <div class="mx-auto w-full max-w-5xl">
              <slot />
            </div>
          </main>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.dashboard-aside {
  width: 240px !important;
}
</style>
