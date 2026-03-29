<script setup lang="ts">
</script>

<template>
  <div class="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-500">
    <div class="flex items-center justify-between mb-8">
      <h4 class="text-2xl font-bold text-white">Overview</h4>
      <button class="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all">+ New Link</button>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div class="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl">
        <p class="text-neutral-500 text-xs font-semibold uppercase tracking-wider mb-2">Total Clicks</p>
        <p class="text-2xl font-bold text-white">12,492</p>
        <p class="text-emerald-400 text-xs mt-2 flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 16 4-4 4 4 8-8"/><path d="m14 8 5-5v5"/></svg> 14% this week</p>
      </div>
      <div class="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl">
        <p class="text-neutral-500 text-xs font-semibold uppercase tracking-wider mb-2">Link Searches</p>
        <p class="text-2xl font-bold text-white">8,103</p>
        <p class="text-emerald-400 text-xs mt-2 flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 16 4-4 4 4 8-8"/><path d="m14 8 5-5v5"/></svg> 22% this week</p>
      </div>
      <div class="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl">
        <p class="text-neutral-500 text-xs font-semibold uppercase tracking-wider mb-2">Active Codes</p>
        <p class="text-2xl font-bold text-white">42</p>
      </div>
    </div>
  </div>
</template>
