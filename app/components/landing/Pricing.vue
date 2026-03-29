<script setup lang="ts">
import { ref } from 'vue'
const isAnnual = ref(false)
</script>

<template>
  <section id="pricing" class="w-full py-16">
    <div class="text-center max-w-2xl mx-auto mb-16 space-y-4">
      <h2 class="text-indigo-400 font-semibold tracking-wide uppercase text-sm">Pricing</h2>
      <h3 class="text-3xl md:text-5xl font-bold text-white tracking-tight">Simple pricing for creators</h3>
      <p class="text-neutral-400 text-lg">Start for free, upgrade when you need supercharged features.</p>

      <div class="flex items-center justify-center gap-3 pt-6">
        <span class="text-sm font-medium" :class="!isAnnual ? 'text-white' : 'text-neutral-500'">Monthly</span>
        <button 
          @click="isAnnual = !isAnnual"
          class="relative w-12 h-6 rounded-full bg-neutral-800 border border-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          :class="isAnnual ? 'bg-indigo-500 border-indigo-500' : ''"
        >
          <div 
            class="absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform shadow-sm"
            :class="isAnnual ? 'translate-x-6' : ''"
          ></div>
        </button>
        <span class="text-sm font-medium" :class="isAnnual ? 'text-white' : 'text-neutral-500'">Yearly <span class="text-indigo-400 text-xs ml-1">-20%</span></span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
      
      <!-- Free Plan -->
      <div class="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-8 md:p-10 transition-transform hover:-translate-y-1">
        <h4 class="text-2xl font-bold text-white mb-2">Free Link</h4>
        <p class="text-neutral-400 mb-6 text-sm">Perfect for getting started and testing the waters.</p>
        <div class="flex items-end gap-1 mb-8">
          <span class="text-5xl font-black text-white">$0</span>
          <span class="text-neutral-500 mb-1 font-medium">/ forever</span>
        </div>
        <ul class="space-y-4 mb-8">
          <li class="flex items-center gap-3 text-neutral-300">
            <svg class="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg>
            Up to 10 active links
          </li>
          <li class="flex items-center gap-3 text-neutral-300">
            <svg class="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg>
            Basic analytics (last 7 days)
          </li>
          <li class="flex items-center gap-3 text-neutral-300">
            <svg class="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg>
            Standard bio page
          </li>
        </ul>
        <button class="w-full py-3.5 rounded-xl bg-neutral-800 text-white font-semibold hover:bg-neutral-700 transition-colors">Get currently free</button>
      </div>

      <!-- Pro Plan -->
      <div class="bg-gradient-to-b from-indigo-500/10 to-neutral-900 border border-indigo-500/50 rounded-[2rem] p-8 md:p-10 relative shadow-2xl shadow-indigo-500/10 transition-transform hover:-translate-y-1">
        <div class="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
        <div class="absolute hidden sm:block top-6 right-6 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-500/30">Most Popular</div>
        
        <h4 class="text-2xl font-bold text-white mb-2">Pro Creator</h4>
        <p class="text-neutral-400 mb-6 text-sm">Everything you need to scale your affiliate earnings.</p>
        <div class="flex items-end gap-1 mb-8">
          <span class="text-5xl font-black text-white">$<span v-if="isAnnual">1.59</span><span v-else>1.99</span></span>
          <span class="text-neutral-500 mb-1 font-medium">/ month</span>
        </div>
        <ul class="space-y-4 mb-8">
          <li class="flex items-center gap-3 text-neutral-200 font-medium">
            <svg class="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg>
            Unlimited active links
          </li>
          <li class="flex items-center gap-3 text-neutral-200 font-medium">
            <svg class="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg>
            Advanced analytics & search tracking
          </li>
          <li class="flex items-center gap-3 text-neutral-200 font-medium">
            <svg class="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg>
            Custom branding & colors
          </li>
          <li class="flex items-center gap-3 text-neutral-200 font-medium">
            <svg class="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg>
            Priority support always
          </li>
        </ul>
        <button class="w-full py-3.5 rounded-xl bg-white text-neutral-950 font-bold hover:bg-neutral-100 transition-colors shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98]">Go Pro</button>
      </div>

    </div>
  </section>
</template>
