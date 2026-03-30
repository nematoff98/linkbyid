<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ (e: 'send', text: string): void }>()
const message = ref('')

const submit = () => {
  const text = message.value.trim()
  if (!text) return
  emit('send', text)
  message.value = ''
}
</script>

<template>
  <form class="flex items-center gap-2 border-t border-neutral-200 p-3 dark:border-white/10" @submit.prevent="submit">
    <input
      v-model="message"
      type="text"
      placeholder="Write a message..."
      class="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none ring-indigo-400 transition focus:ring-2 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-100"
    >
    <button
      type="submit"
      class="h-10 rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-500"
    >
      Send
    </button>
  </form>
</template>
