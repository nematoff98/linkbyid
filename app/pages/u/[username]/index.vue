<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import PageWrapper from '~/components/public/PageWrapper.vue'
import ProfileHeader from '~/components/public/ProfileHeader.vue'
import SearchInput from '~/components/public/SearchInput.vue'
import ProductCard from '~/components/public/ProductCard.vue'
import EmptyState from '~/components/public/EmptyState.vue'
import type { Product } from '~/components/public/ProductCard.vue'

const route = useRoute()
const username = route.params.username as string

const DUMMY_PRODUCTS: Product[] = [
  { id: '1', code: '8472', title: 'Sony WH-1000XM5', description: 'Industry leading noise canceling headphones.', imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647bba?w=400&q=80', url: '#' },
  { id: '2', code: '1942', title: 'Apple Watch Ultra', description: 'Rugged and capable smartwatch designed for exploration.', imageUrl: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=400&q=80', url: '#' },
  { id: '3', code: '5501', title: 'Keychron Q1 Pro', description: 'Custom mechanical keyboard.', imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&q=80', url: '#' }
]

const profile = {
  username,
  bio: 'Video tagida yozilgan kodni kiriting va men tavsiya qilgan mahsulotni bir necha soniyada toping.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256'
}

const isSearching = ref(false)
const searchResult = ref<Product | null>(null)
const searchError = ref(false)
const initialSearch = ref('')
const currentQuery = ref('')
const isDark = ref(true)
let searchTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  if (import.meta.client) {
    const saved = localStorage.getItem(`lastSearch_${username}`)
    if (saved) initialSearch.value = saved

    const savedTheme = localStorage.getItem('profile_theme_mode')
    if (savedTheme === 'light') isDark.value = false
    else if (savedTheme === 'dark') isDark.value = true
    else isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})

const handleSearch = (query: string) => {
  const cleanQuery = query.trim().toLowerCase()
  if (searchTimer) {
    clearTimeout(searchTimer)
    searchTimer = null
  }
  if (!cleanQuery) {
    isSearching.value = false
    searchResult.value = null
    searchError.value = false
    if (import.meta.client) localStorage.removeItem(`lastSearch_${username}`)
    return
  }
  isSearching.value = true
  searchError.value = false
  searchResult.value = null
  if (import.meta.client) localStorage.setItem(`lastSearch_${username}`, cleanQuery)
  searchTimer = setTimeout(() => {
    isSearching.value = false
    const found = DUMMY_PRODUCTS.find(p => p.code.toLowerCase() === cleanQuery || p.title.toLowerCase().includes(cleanQuery))
    if (found) searchResult.value = found
    else searchError.value = true
    searchTimer = null
  }, 400)
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (import.meta.client) localStorage.setItem('profile_theme_mode', isDark.value ? 'dark' : 'light')
}

const showSearchHint = computed(() => currentQuery.value.trim().length === 0)

const handleQueryChange = (query: string) => {
  currentQuery.value = query
  if (!query.trim()) {
    handleSearch('')
  }
}

useHead({
  title: `@${username} | Link by Code`,
  meta: [{ name: 'description', content: profile.bio }]
})
</script>

<template>
  <PageWrapper :is-dark="isDark">
    <div class="mb-5 flex justify-end">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
        @click="toggleTheme"
      >
        <span>{{ isDark ? 'Dark' : 'Light' }}</span>
      </button>
    </div>

    <ProfileHeader v-bind="profile" />
    <SearchInput
      :is-searching="isSearching"
      :initial-query="initialSearch"
      @search="handleSearch"
      @query-change="handleQueryChange"
    />

    <div class="relative mb-5 mt-1 w-full border-b  border-b-neutral-200 dark:border-white/12 h-[210px] sm:h-[190px]">
      <Transition name="fade" mode="out-in">
        <div v-if="showSearchHint" class="w-full h-full flex justify-center items-center">
          <p class="text-center text-[12px] text-neutral-500 dark:text-neutral-400">Kodni kiriting, natija shu yerda chiqadi.</p>
        </div>

        <div v-else-if="searchResult" class="w-full py-2">
          <div class="mb-4 flex items-center justify-between px-0.5">
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              <h3 class="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">Match found</h3>
            </div>
            <button @click="handleSearch('')" class="text-[12px] font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white">Clear</button>
          </div>
          <ProductCard :product="searchResult" />
        </div>

        <div v-else-if="searchError && !isSearching" class="w-full pt-2">
          <EmptyState title="Code topilmadi" message="Videodagi kodni qayta tekshirib, yana kiriting." />
        </div>
      </Transition>
    </div>

    <div class="mt-2 w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 pt-5 dark:border-white/12 dark:bg-neutral-900/45 sm:mt-3 sm:p-5 sm:pt-6">
      <div class="mb-4 flex items-center justify-between gap-3 px-0.5">
        <h3 class="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">Other products</h3>
        <span class="rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-600 dark:border-white/14 dark:bg-white/6 dark:text-neutral-300">by @{{ username }}</span>
      </div>
      <p class="mb-4 text-xs text-neutral-500 dark:text-neutral-400">Bu bo'lim kod qidiruvi natijasi emas, umumiy tavsiya qilingan mahsulotlar.</p>
      <div class="flex flex-col gap-3">
         <ProductCard v-for="product in DUMMY_PRODUCTS" :key="product.id" :product="product" />
      </div>
    </div>

    <div class="mt-8 flex w-full justify-center border-t border-neutral-200 pt-6 dark:border-white/10">
       <span class="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:border-white/14 dark:bg-white/5 dark:text-neutral-300">
         Powered by LinkByCode
       </span>
    </div>
  </PageWrapper>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

