<script setup lang="ts">
import { computed } from 'vue'
import type { ProfileSettings } from '~/types/dashboard'
import avatarIcon from '~/assets/icons/avatar.svg'

const props = defineProps<{ profile: ProfileSettings }>()
const avatarSrc = computed(() => props.profile.avatar || '')
const hasCustomAvatar = computed(() => Boolean(props.profile.avatar))
const previewUsername = computed(() => props.profile.username?.trim() || 'your_username')
</script>

<template>
  <section class="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900">
    <h2 class="text-base font-semibold text-neutral-900 dark:text-white">Public profile preview</h2>
    <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">This is how `/u/{{ previewUsername }}` looks.</p>

    <div class="mt-5 flex flex-col items-center text-center">
      <div class="h-20 w-20 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 dark:border-white/15 dark:bg-neutral-800">
        <img v-if="hasCustomAvatar" :src="avatarSrc" :alt="props.profile.username || 'avatar'" class="h-full w-full object-cover">
        <img v-else :src="avatarIcon" alt="Default avatar icon" class="h-full w-full scale-75 object-contain">
      </div>
      <h3 class="mt-3 text-xl font-semibold text-neutral-900 dark:text-white">@{{ previewUsername }}</h3>
      <p class="mt-1 max-w-sm whitespace-pre-wrap break-words text-sm text-neutral-600 dark:text-neutral-300">{{ props.profile.bio || 'Your bio will appear here.' }}</p>
    </div>

    <div class="mt-5">
      <label class="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">Search by code</label>
      <input type="text" disabled placeholder="Preview only" class="w-full rounded-xl border border-neutral-200 bg-neutral-100 px-3 py-2 text-sm text-neutral-500 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-400">
      <p class="mt-2 text-xs text-neutral-500 dark:text-neutral-400">Search and products are hidden in this preview.</p>
    </div>
  </section>
</template>
