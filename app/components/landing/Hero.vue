<script setup lang="ts">
import HeroMockup from '~/components/landing/HeroMockup.vue'
</script>

<template>
  <section class="w-full min-h-[80vh] flex flex-col pt-8 md:pt-24 md:flex-row items-center justify-between gap-10 lg:gap-20">
    <!-- Left text content -->
    <div class="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out z-10">
      <div class="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs sm:text-sm font-medium text-indigo-300">
        <span class="flex h-2 w-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
        Built for modern creators
      </div>
      
      <h1 class="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
        Turn simple codes into <span class="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">powerful</span> product links.
      </h1>
      
      <p class="text-base sm:text-lg md:text-xl text-neutral-400 max-w-xl leading-relaxed">
        Share products using short codes and a single bio link. No more messy links or lost conversions. Welcome to the future of product sharing.
      </p>
      
      <div class="flex flex-col sm:flex-row items-center gap-4 pt-2">
        <NuxtLink to="/auth" class="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-2xl bg-white text-neutral-950 font-semibold text-center transition-all hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-white/5 disabled:opacity-50">
          Get Started
        </NuxtLink>
        <a href="#demo" class="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-white font-semibold text-center hover:bg-neutral-800 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
          Watch Demo
        </a>
      </div>
    </div>

    <HeroMockup />
  </section>
</template>
