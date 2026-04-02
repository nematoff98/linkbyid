<script setup lang="ts">
export interface Product {
  id: string
  code: string
  title: string
  description?: string
  imageUrl?: string
  url: string
  userId?: string
}

const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ (e: 'card-click', product: Product): void }>()
const fallbackImg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="%23d4d4d8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>'

const imageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = fallbackImg
}
</script>

<template>
  <a
    :href="product.url"
    target="_blank"
    rel="noopener noreferrer"
    class="group flex w-full items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-3.5 transition-all duration-200 hover:border-indigo-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/70 dark:border-white/12 dark:bg-neutral-900 dark:hover:border-indigo-300/45"
    data-testid="product-card"
    @click="emit('card-click', props.product)"
  >
    <div class="relative flex h-[70px] w-[70px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 sm:h-[78px] sm:w-[78px] dark:border-white/12 dark:bg-neutral-800">
      <img 
        v-if="product.imageUrl" 
        :src="product.imageUrl" 
        :alt="product.title" 
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        @error="imageError"
      >
      <img v-else :src="fallbackImg" class="w-8 h-8 opacity-50">
    </div>
    
    <div class="min-w-0 flex-1 py-0.5">
      <div class="mb-2 flex items-center gap-2">
        <h3 class="truncate text-[15px] font-semibold text-neutral-900 sm:text-base dark:text-white">{{ product.title }}</h3>
        <span class="shrink-0 rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200">{{ product.code }}</span>
      </div>
      <p v-if="product.description" class="mb-1.5 line-clamp-2 text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-300">{{ product.description }}</p>
      <div class="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-indigo-700 transition-colors group-hover:text-indigo-500 dark:text-indigo-200 dark:group-hover:text-indigo-100">
        Open link
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
      </div>
    </div>
  </a>
</template>
