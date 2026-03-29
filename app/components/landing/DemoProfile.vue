<script setup lang="ts">
</script>

<template>
  <div class="w-full max-w-sm mx-auto flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
    <div class="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 mb-4 shadow-lg shadow-purple-500/20">
      <div class="w-full h-full bg-neutral-900 rounded-full border-2 border-neutral-900 overflow-hidden">
         <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256" alt="Creator" class="w-full h-full object-cover">
      </div>
    </div>
    <h4 class="text-xl font-bold text-white">Sarah Jenkins</h4>
    <p class="text-neutral-400 mb-8 mt-1 text-sm">Tech & Lifestyle Recommendations ✨</p>
    
    <div class="w-full relative group">
      <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-400"><path d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/></svg>
      </div>
      <input type="text" placeholder="Enter product code (e.g. 1942)" class="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner">
    </div>

    <!-- Example links -->
    <div class="w-full mt-6 space-y-3">
       <div class="w-full p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 flex items-center gap-4 transition-colors cursor-pointer group">
          <div class="w-12 h-12 rounded-lg bg-neutral-800 flex-shrink-0 overflow-hidden text-xs">
             <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=150&h=150" alt="Watch" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
          </div>
          <div class="flex-1">
            <h5 class="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">Apple Watch Ultra</h5>
            <p class="text-xs text-neutral-500">Code: 1942</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-neutral-600 group-hover:text-white transition-colors group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
       </div>
    </div>
  </div>
</template>
