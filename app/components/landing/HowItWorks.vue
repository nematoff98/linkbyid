<script setup lang="ts">
const steps = [
  {
    number: '01',
    title: 'Add your product link',
    description: 'Paste your affiliate link, product page, or any URL you want to share. We automatically fetch the metadata.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-400"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
  },
  {
    number: '02',
    title: 'Get a simple code',
    description: 'Each link gets a short, memorable code—letters, numbers, or a mix. No more messy, illegible URLs to share on videos.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-400"><path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5l-3.5 3.5V18H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h13Z"/></svg>'
  },
  {
    number: '03',
    title: 'Share & direct visitors',
    description: 'Tell your audience to search for a code—for example "XM5"—on your bio link. They find exactly what they need in seconds.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-400"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>'
  }
]
</script>

<template>
  <section id="how-it-works" class="w-full relative py-10 sm:py-12">
    <div class="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-4">
      <h2 class="text-indigo-400 font-semibold tracking-wide uppercase text-sm">How it works</h2>
      <h3 class="text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-tight">Three steps to simplicity</h3>
      <p class="text-neutral-400 text-base sm:text-lg">Stop relying on deep links in descriptions. Consolidate your strategy into an intuitive search experience.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 relative">
      <!-- Decorative path connecting steps -->
      <div class="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-transparent via-neutral-800 to-transparent z-0"></div>
      
      <div 
        v-for="step in steps" 
        :key="step.number"
        class="relative z-10 flex flex-col items-center text-center group"
      >
        <div class="w-20 h-20 sm:w-24 sm:h-24 bg-neutral-900 border border-neutral-800 rounded-3xl flex items-center justify-center mb-5 sm:mb-6 shadow-xl relative transition-transform duration-300 group-hover:-translate-y-2">
           <div class="absolute inset-x-0 -top-2 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent h-px opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-neutral-950 flex items-center justify-center" v-html="step.icon"></div>
           <div class="absolute -bottom-2.5 -right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] sm:text-xs font-bold ring-4 ring-neutral-950 shadow-sm shadow-indigo-500/50">{{ step.number }}</div>
        </div>
        
        <h4 class="text-lg sm:text-xl font-bold text-white mb-2.5 sm:mb-3">{{ step.title }}</h4>
        <p class="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-[280px]">
          {{ step.description }}
        </p>
      </div>
    </div>
  </section>
</template>
