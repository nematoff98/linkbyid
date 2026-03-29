<script setup lang="ts">
</script>

<template>
  <section class="w-full py-12 md:py-24 relative overflow-hidden">
    <!-- Background element -->
    <div class="absolute inset-x-8 inset-y-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-neutral-900 border border-indigo-500/20 rounded-[3rem] -z-10 shadow-2xl shadow-indigo-500/10 overflow-hidden">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      <div class="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/30 blur-[100px] rounded-full pointer-events-none"></div>
    </div>

    <div class="max-w-4xl mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center space-y-8 z-10 relative">
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-indigo-500/20 mb-2">
         <span class="translate-y-[2px]">#</span>
      </div>
      
      <h2 class="text-4xl md:text-6xl font-bold text-white tracking-tight text-center max-w-3xl leading-[1.1]">
        Start sharing <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">smarter links</span> today
      </h2>
      
      <p class="text-xl text-neutral-400 max-w-xl mx-auto">
        Join leading creators who are simplifying their bios and boosting their product conversions.
      </p>

      <div class="pt-6">
        <a href="#get-started" class="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-12 py-5 bg-white text-neutral-950 font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 hover:shadow-white/20">
          <span class="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
          <span class="relative flex items-center gap-2">
            Get Started for Free
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
      </div>
      
      <p class="text-sm text-neutral-500 mt-4">No credit card required to start.</p>
    </div>
  </section>
</template>
