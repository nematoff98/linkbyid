<script setup lang="ts">
defineProps<{
  message: {
    id: number
    text: string
    sender: 'user' | 'support'
    time: string
  }
}>()
</script>

<template>
  <div :class="message.sender === 'user' ? 'items-end' : 'items-start'" class="flex flex-col gap-1">
    <div
      class="max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed"
      :class="message.sender === 'user'
        ? 'bg-indigo-600 text-white rounded-br-md'
        : 'bg-neutral-100 text-neutral-800 rounded-bl-md dark:bg-neutral-700 dark:text-neutral-100'"
    >
      {{ message.text }}
    </div>
    <span class="px-1 text-[10px] text-neutral-400">{{ message.time }}</span>
  </div>
</template>
