<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { ChatDotRound } from '@element-plus/icons-vue'
import { TransitionFade } from '@morev/vue-transitions'
import ChatInput from '~/components/dashboard/ChatInput.vue'
import ChatMessage from '~/components/dashboard/ChatMessage.vue'

type ChatItem = {
  id: number
  text: string
  sender: 'user' | 'support'
  time: string
}

const isOpen = ref(false)
const messages = ref<ChatItem[]>([
  { id: 1, text: 'Hi! Need help with billing or links?', sender: 'support' as const, time: 'now' }
])
const bodyRef = ref<HTMLElement | null>(null)

const addUserMessage = (text: string) => {
  messages.value.push({ id: Date.now(), text, sender: 'user', time: 'just now' })
  setTimeout(() => {
    messages.value.push({ id: Date.now() + 1, text: 'Thanks! Our support team will reply shortly.', sender: 'support', time: 'just now' })
  }, 400)
}

watch(messages, async () => {
  await nextTick()
  if (bodyRef.value) bodyRef.value.scrollTop = bodyRef.value.scrollHeight
}, { deep: true })
</script>

<template>
  <div class="fixed bottom-5 right-5 z-40">
    <TransitionFade mode="out-in" :duration="200">
      <div v-if="isOpen" key="panel" class="mb-3 w-[calc(100vw-1.5rem)] max-w-[340px] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-white/10 dark:bg-neutral-900">
        <div class="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-white/10">
          <p class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Support chat</p>
          <button class="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-100" @click="isOpen = false">Close</button>
        </div>
        <div ref="bodyRef" class="max-h-80 min-h-60 space-y-3 overflow-y-auto px-3 py-3">
          <ChatMessage v-for="message in messages" :key="message.id" :message="message" />
        </div>
        <ChatInput @send="addUserMessage" />
      </div>
      <button
        v-else
        key="button"
        class="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-indigo-500"
        @click="isOpen = true"
      >
        <ChatDotRound class="h-6 w-6" />
      </button>
    </TransitionFade>
  </div>
</template>
