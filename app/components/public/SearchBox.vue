<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  isSearching?: boolean
  initialQuery?: string
}>()

const emit = defineEmits<{
  (e: 'search', query: string): void
}>()

const query = ref(props.initialQuery || '')
const inputRef = ref<HTMLInputElement | null>(null)

// Focus on mount for instant UX
onMounted(() => {
  setTimeout(() => inputRef.value?.focus(), 150)
  if (props.initialQuery) emit('search', props.initialQuery)
})

watch(() => props.initialQuery, (newVal) => {
  if (newVal !== undefined && newVal !== query.value) query.value = newVal
})

let timeout: ReturnType<typeof setTimeout>
const handleInput = () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    emit('search', query.value)
  }, 400) // debounce
}

const handleSubmit = () => {
  clearTimeout(timeout)
  emit('search', query.value)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="w-full max-w-xl mx-auto relative group z-20">
    <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10"></div>
    
    <div class="relative bg-neutral-900 border border-neutral-800 rounded-[2rem] shadow-xl overflow-hidden transition-all group-focus-within:border-indigo-500/50 group-focus-within:shadow-indigo-500/10">
      <div class="absolute inset-y-0 left-5 flex items-center pointer-events-none">
        <svg v-if="!isSearching" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" class="text-indigo-400 group-focus-within:text-indigo-300 transition-colors" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" class="text-indigo-400 animate-spin" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      </div>
      
      <input 
        ref="inputRef"
        v-model="query"
        @input="handleInput"
        type="search" 
        placeholder="Enter product code (e.g. XM5)" 
        class="w-full bg-transparent border-none py-5 pl-14 pr-28 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-0 text-lg sm:text-xl md:text-2xl font-mono text-center sm:text-left transition-colors"
      >
      
      <button 
        type="submit"
        class="absolute inset-y-2 right-2 px-6 bg-white hover:bg-neutral-100 text-neutral-950 rounded-2xl font-bold text-sm transition-transform active:scale-95 flex items-center justify-center shadow-lg"
      >
        Search
      </button>
    </div>
  </form>
</template>
