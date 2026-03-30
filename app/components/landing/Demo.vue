<script setup lang="ts">
import { ref } from 'vue'
import DemoProfile from '~/components/landing/DemoProfile.vue'
import DemoDashboard from '~/components/landing/DemoDashboard.vue'

const activeTab = ref('profile')
</script>

<template>
  <section id="demo" class="w-full py-12 sm:py-16">
    <div class="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-4">
      <h2 class="text-purple-400 font-semibold tracking-wide uppercase text-sm">Showcase</h2>
      <h3 class="text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-tight">Your beautiful new storefront</h3>
      <p class="text-neutral-400 text-base sm:text-lg">Give your followers an app-like experience to discover your favorite products without ever leaving their favorite social app.</p>
    </div>

    <div class="max-w-4xl mx-auto w-full relative">
      <div class="absolute -inset-1 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-2xl rounded-[3rem] -z-10"></div>
      
      <div class="bg-neutral-900 border border-neutral-800 rounded-[1.75rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div class="bg-neutral-950 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-neutral-800 gap-2">
          <div class="flex gap-2">
            <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div class="flex bg-neutral-900 rounded-lg p-1 border border-neutral-800">
            <button 
              class="px-2.5 sm:px-4 py-1.5 text-[10px] sm:text-xs font-semibold rounded-md transition-all"
              :class="activeTab === 'profile' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-white'"
              @click="activeTab = 'profile'"
            >Public Profile</button>
            <button 
              class="px-2.5 sm:px-4 py-1.5 text-[10px] sm:text-xs font-semibold rounded-md transition-all"
              :class="activeTab === 'admin' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-white'"
              @click="activeTab = 'admin'"
            >Dashboard</button>
          </div>
          <div class="hidden sm:block w-[52px]"></div>
        </div>

        <div class="p-5 sm:p-8 md:p-12 min-h-[340px] sm:min-h-[400px] flex items-center justify-center bg-[#0a0a0a]">
          <DemoProfile v-if="activeTab === 'profile'" />
          <DemoDashboard v-else />
        </div>
      </div>
    </div>
  </section>
</template>
