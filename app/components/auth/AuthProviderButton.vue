<script setup lang="ts">
const props = defineProps<{
  label: string
  provider: 'google' | 'apple'
  loading?: boolean
}>()

const emit = defineEmits<{ (e: 'select', provider: 'google' | 'apple'): void }>()
</script>

<template>
  <button
    class="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-800 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/15 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
    :disabled="props.loading"
    @click="emit('select', props.provider)"
  >
    <svg v-if="provider === 'google'" class="h-5 w-5" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.8-2.7-5.8-6s2.6-6 5.8-6c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.7 3.6 14.6 2.7 12 2.7A9.3 9.3 0 0 0 2.7 12c0 5.1 4.2 9.3 9.3 9.3 5.4 0 8.9-3.8 8.9-9.1 0-.6-.1-1.1-.2-1.6H12z"/><path fill="#34A853" d="M2.7 7.8 5.9 10A5.6 5.6 0 0 1 12 6c1.8 0 3 .8 3.7 1.5l2.5-2.4A9.2 9.2 0 0 0 12 2.7c-3.6 0-6.8 2-8.5 5.1z"/><path fill="#FBBC05" d="M12 21.3c2.5 0 4.6-.8 6.2-2.3l-2.9-2.3c-.8.5-1.9.9-3.3.9-2.5 0-4.6-1.7-5.3-4l-3.3 2.6A9.3 9.3 0 0 0 12 21.3z"/><path fill="#4285F4" d="M20.9 12.2c0-.6-.1-1.1-.2-1.6H12v3.9h5.4c-.3 1.2-1.1 2.2-2.1 2.9l2.9 2.3c1.7-1.5 2.7-4 2.7-7.5z"/></svg>
    <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M16.1 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.1 2.6-1.8 3.2-.5 8 1.3 10.5.9 1.2 1.9 2.5 3.2 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.4 0 2.3-1.2 3.1-2.4.9-1.3 1.3-2.5 1.3-2.6 0 0-2.5-1-2.5-4zM13.8 5.5c.7-.9 1.2-2.1 1.1-3.3-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.2 3.2 1.2.1 2.4-.6 3.1-1.5z"/></svg>
    <span>{{ props.loading ? 'Connecting...' : props.label }}</span>
  </button>
</template>
