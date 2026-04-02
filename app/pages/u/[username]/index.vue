<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import PageWrapper from '~/components/public/PageWrapper.vue'
import ProfileHeader from '~/components/public/ProfileHeader.vue'
import SearchInput from '~/components/public/SearchInput.vue'
import ProductCard from '~/components/public/ProductCard.vue'
import EmptyState from '~/components/public/EmptyState.vue'
import type { Product } from '~/components/public/ProductCard.vue'
import { linksService } from '~/services/links.service'
import { profileService } from '~/services/profile.service'
import { analyticsService } from '~/services/analytics.service'

const route = useRoute()
const username = route.params.username as string

const profile = reactive({
  username,
  bio: '',
  avatarUrl: ''
})

const isSearching = ref(false)
const searchResult = ref<Product | null>(null)
const searchError = ref(false)
const initialSearch = ref('')
const currentQuery = ref('')
const isDark = ref(true)
const popularProducts = ref<Product[]>([])
const popularLoading = ref(false)
const ownerUserId = ref('')
let requestId = 0

onMounted(() => {
  if (import.meta.client) {
    const saved = localStorage.getItem(`lastSearch_${username}`)
    if (saved) initialSearch.value = saved

    const savedTheme = localStorage.getItem('profile_theme_mode')
    if (savedTheme === 'light') isDark.value = false
    else if (savedTheme === 'dark') isDark.value = true
    else isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  loadProfile()
  loadPopularLinks()
})

const handleSearch = (query: string) => {
  const cleanQuery = query.trim().toLowerCase()
  requestId += 1
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
  const currentRequest = requestId
  linksService.searchPublicLinks(username, cleanQuery)
    .then((items) => {
      if (currentRequest !== requestId) return
      isSearching.value = false
      if (!ownerUserId.value && items[0]?.userId) ownerUserId.value = items[0].userId
      const found = items[0] || null
      searchResult.value = found
      searchError.value = !found
      const sourceUrl = import.meta.client ? `${window.location.origin}/search` : 'https://app.linkbycode.uz/search'
      if (ownerUserId.value) {
        analyticsService.trackSearch(ownerUserId.value, cleanQuery, sourceUrl).catch(() => {})
      }
    })
    .catch(() => {
      if (currentRequest !== requestId) return
      isSearching.value = false
      searchResult.value = null
      searchError.value = true
    })
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

const loadPopularLinks = async () => {
  popularLoading.value = true
  try {
    popularProducts.value = await linksService.getPopularLinks(username, 1, 3)
    if (popularProducts.value[0]?.userId) ownerUserId.value = popularProducts.value[0].userId
  } catch {
    popularProducts.value = []
  } finally {
    popularLoading.value = false
  }
}

const trackProductClick = (product: Product) => {
  const referrer = import.meta.client ? (document.referrer || window.location.href) : ''
  analyticsService.trackClick(username, product.code, referrer).catch(() => {})
}

const loadProfile = async () => {
  try {
    const response = await profileService.getByUsername(username)
    profile.username = response.username
    profile.bio = response.bio
    profile.avatarUrl = response.avatarUrl
  } catch {
    profile.username = username
    profile.bio = ''
    profile.avatarUrl = ''
  }
}

useHead(() => ({
  title: `@${profile.username || username} | Link by Code`,
  meta: [{ name: 'description', content: profile.bio || 'Public profile' }]
}))
</script>

<template>
  <PageWrapper :is-dark="isDark">
    <div class="mb-5 flex justify-end">
      <button
        type="button"
        class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
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

    <div class="relative mb-4 mt-1 h-[190px] w-full border-b border-b-neutral-200 dark:border-white/12 sm:mb-5 sm:h-[190px]">
      <Transition name="fade" mode="out-in">
        <div v-if="showSearchHint" class="w-full h-full flex justify-center items-center">
          <p class="text-center text-[12px] text-neutral-500 dark:text-neutral-400">Enter a code — results appear here.</p>
        </div>

        <div v-else-if="searchResult" class="w-full py-2">
          <div class="mb-4 flex items-center justify-between px-0.5">
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              <h3 class="text-[12px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">Match found</h3>
            </div>
            <button @click="handleSearch('')" class="text-[12px] font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white">Clear</button>
          </div>
          <ProductCard :product="searchResult" @card-click="trackProductClick" />
        </div>

        <div v-else-if="searchError && !isSearching" class="w-full pt-2">
          <EmptyState title="Code not found" message="Check the code and try again." />
        </div>
      </Transition>
    </div>

    <div class="mt-2 w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3.5 pt-4.5 dark:border-white/12 dark:bg-neutral-900/45 sm:mt-3 sm:p-5 sm:pt-6">
      <div class="mb-4 flex flex-col items-start gap-2 px-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <h3 class="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400 sm:text-[11px] sm:tracking-[0.18em]">Most popular</h3>
        <span class="max-w-[70vw] truncate rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[10px] font-medium normal-case tracking-normal text-neutral-600 dark:border-white/14 dark:bg-white/6 dark:text-neutral-300 sm:max-w-none sm:uppercase sm:tracking-[0.15em]">by @{{ username }}</span>
      </div>
      <p class="mb-4 text-xs text-neutral-500 dark:text-neutral-400">Links users click the most.</p>
      <div class="flex flex-col gap-3">
         <ProductCard v-for="product in popularProducts" :key="product.id" :product="product" @card-click="trackProductClick" />
         <p v-if="popularLoading" class="text-xs text-neutral-500 dark:text-neutral-400">Loading most popular links…</p>
         <p v-if="!popularLoading && popularProducts.length === 0" class="text-xs text-neutral-500 dark:text-neutral-400">No popular links found.</p>
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

