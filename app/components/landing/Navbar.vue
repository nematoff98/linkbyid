<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'How it works', href: '#how-it-works' },
  { name: 'Demo', href: '#demo' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'FAQ', href: '#faq' },
]
</script>

<template>
  <header 
    class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-50 transition-all duration-300"
    :class="isScrolled ? 'py-3' : 'py-5'"
  >
    <div 
      class="flex items-center justify-between mx-auto border backdrop-blur-xl px-6 py-3 shadow-2xl transition-all duration-300 rounded-2xl max-w-full"
      :class="isScrolled ? 'bg-neutral-900/60 border-neutral-800 shadow-neutral-900/50' : 'bg-transparent border-transparent shadow-none'"
    >
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-3 group focus:outline-none">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300">
          <span class="translate-y-[1px]">#</span>
        </div>
        <span class="font-bold text-lg tracking-tight text-white hidden sm:block">Link by Code</span>
      </NuxtLink>

      <!-- Desktop Links -->
      <nav class="hidden md:flex items-center gap-8">
        <a 
          v-for="link in navLinks" 
          :key="link.name" 
          :href="link.href" 
          class="text-sm font-medium text-neutral-400 hover:text-white transition-colors duration-200 focus:outline-none focus:text-white"
        >
          {{ link.name }}
        </a>
      </nav>

      <!-- CTA -->
      <div class="flex items-center gap-5">
        <NuxtLink to="/auth" class="text-sm font-medium text-neutral-300 hover:text-white transition-colors hidden sm:block focus:outline-none">Login</NuxtLink>
        <NuxtLink to="/auth" class="relative group px-5 py-2.5 rounded-xl bg-white text-neutral-950 font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-md shadow-white/10 hover:shadow-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-950">
          <span class="relative z-10 flex items-center gap-1.5">
            Get Started
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </span>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
