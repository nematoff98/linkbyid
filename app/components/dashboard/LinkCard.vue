<script setup lang="ts">
import type { DashboardLink } from '~/types/dashboard'

const props = defineProps<{ link: DashboardLink }>()
const emit = defineEmits<{ (e: 'edit', link: DashboardLink): void; (e: 'delete', id: number): void }>()
</script>

<template>
  <div class="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md md:flex-row dark:border-white/10 dark:bg-neutral-900">
    <img :src="props.link.image" :alt="props.link.title" class="h-20 w-full rounded-lg object-cover md:w-32">
    <div class="flex-1">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="text-base font-semibold text-neutral-900 dark:text-white">{{ props.link.title }}</h3>
          <p class="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{{ props.link.description }}</p>
        </div>
        <span class="rounded-lg bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">{{ props.link.code }}</span>
      </div>
      <div class="mt-3 flex items-center gap-2">
        <button class="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50 dark:border-white/15 dark:hover:bg-white/10" @click="emit('edit', props.link)">Edit</button>
        <button class="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-red-400/30 dark:hover:bg-red-500/10" @click="emit('delete', props.link.id)">Delete</button>
      </div>
    </div>
  </div>
</template>
