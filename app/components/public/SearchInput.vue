<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{ isSearching?: boolean, initialQuery?: string }>()
const emit = defineEmits<{
  (e: 'search', query: string): void
  (e: 'query-change', query: string): void
}>()

const query = ref(props.initialQuery || '')
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  setTimeout(() => inputRef.value?.focus(), 150)
  emit('query-change', query.value)
  if (props.initialQuery) emit('search', props.initialQuery)
})

watch(() => props.initialQuery, (newVal) => {
  if (newVal !== undefined && newVal !== query.value) query.value = newVal
})

let timeout: ReturnType<typeof setTimeout>
const handleInput = () => {
  emit('query-change', query.value)
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    emit('search', query.value)
  }, 400)
}

const clearQuery = () => {
  query.value = ''
  emit('query-change', '')
  emit('search', '')
}
</script>

<template>
  <div class="relative z-20 mb-5 mt-5 w-full">
    <label class="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500 sm:pl-1 dark:text-neutral-400">Kod yoki mahsulot nomi</label>
    <div class="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/20 dark:border-white/12 dark:bg-neutral-900">
      <div class="relative flex h-14 items-center sm:h-[58px]">
        <div class="shrink-0 pl-4 pr-2 text-neutral-500 sm:pl-5 dark:text-neutral-400">
          <svg v-if="isSearching" class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.3"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>

        <input
          ref="inputRef"
          v-model="query"
          @input="handleInput"
          type="search"
          placeholder="Masalan: 8472"
          class="h-full w-full flex-1 border-none bg-transparent px-1 text-[15px] font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none sm:text-base dark:text-white dark:placeholder:text-neutral-500"
          data-testid="search-input"
        >

        <button
          v-if="query"
          @click="clearQuery"
          class="mr-3 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-neutral-600 transition hover:bg-neutral-200 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-400/70 dark:border-white/14 dark:bg-white/8 dark:text-neutral-300 dark:hover:bg-white/14 dark:hover:text-white"
          aria-label="Clear search"
          type="button"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  -webkit-appearance: none;
  appearance: none;
}

input[type="search"] {
  -webkit-appearance: none;
  appearance: none;
}
</style>
