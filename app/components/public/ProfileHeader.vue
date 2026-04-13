<script setup lang="ts">
defineProps<{
  username: string
  bio?: string
  avatarUrl?: string
}>()
</script>

<template>
  <div class="relative z-10 w-full pt-1">
    <div class="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
      <div class="h-20 w-20 rounded-full border border-neutral-200 p-1 shadow-sm sm:h-24 sm:w-24 dark:border-white/20">
        <div class="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
        <img 
          v-if="avatarUrl" 
          :src="avatarUrl" 
          :alt="username" 
          class="w-full h-full object-cover"
          @error="$event.target.src = 'https://ui-avatars.com/api/?name=' + username + '&background=f5f5f5&color=171717'"
        >
          <span v-else class="text-2xl font-medium uppercase text-neutral-500 dark:text-neutral-300">{{ username.charAt(0) }}</span>
        </div>
      </div>

      <div class="mb-5 mt-4 space-y-2 px-3">
        <h1 class="text-[24px] font-bold tracking-tight text-neutral-900 sm:text-[28px] dark:text-white">@{{ username }}</h1>
        <p
          v-if="bio"
          class="mx-auto max-w-[460px] whitespace-pre-wrap break-words text-[14px] leading-relaxed text-neutral-600 sm:text-[15px] dark:text-neutral-300"
        >{{ bio }}</p>
      </div>
    </div>
  </div>
</template>
