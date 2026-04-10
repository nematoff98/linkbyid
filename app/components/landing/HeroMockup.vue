<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isTyping = ref(true)
const typedCode = ref('')
const selectedCode = 'XM5'
let timer: ReturnType<typeof setTimeout>

onMounted(() => { startTypingAnimation() })

const startTypingAnimation = () => {
  let i = 0
  typedCode.value = ''
  isTyping.value = true
  const type = () => {
    if (i < selectedCode.length) {
      typedCode.value += selectedCode.charAt(i)
      i++
      timer = setTimeout(type, 150 + Math.random() * 100)
    } else {
      timer = setTimeout(() => {
        isTyping.value = false
        setTimeout(() => startTypingAnimation(), 4000)
      }, 500)
    }
  }
  timer = setTimeout(type, 1000)
}
</script>

<template>
  <div class="w-full max-w-md flex-1 animate-in fade-in slide-in-from-right-8 duration-[1s] ease-out delay-200 z-10 relative perspective-1000">
    <div class="relative w-full max-w-[360px] mx-auto bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 rotate-[-2deg] transition-transform duration-500 hover:rotate-0 hover:scale-105">
      <div class="flex flex-col gap-2 items-center text-center">
         <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center mb-2">
           <span class="text-2xl font-bold bg-gradient-to-tr from-indigo-400 to-purple-400 text-transparent bg-clip-text">LC</span>
         </div>
         <h3 class="font-semibold text-white">@creator_name</h3>
         <p class="text-sm text-neutral-400">Search my products by code 🔍</p>
      </div>

      <div class="relative">
        <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" class="text-neutral-500" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/></svg>
        </div>
        <input type="text" :value="typedCode" readonly class="w-full bg-neutral-950 border-2 border-neutral-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none font-mono text-lg transition-colors focus:border-indigo-500/50" placeholder="Enter a code...">
        <span v-if="isTyping" class="absolute top-1/2 -translate-y-1/2 w-[2px] h-6 bg-indigo-500 animate-pulse" :style="{ left: `calc(3rem + ${typedCode.length}ch)` }"></span>
      </div>

      <!-- Result Card -->
      <div class="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex gap-4 transition-all duration-500" :class="typedCode === selectedCode && !isTyping ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'">
        <div class="w-20 h-20 rounded-xl bg-neutral-800 flex-shrink-0 overflow-hidden relative group">
          <img src="https://asset.openshop.uz/uploads/products/photos/202506/NwB98s96KcP9qMoMAeLOjMyFwQDy8Uzvl9sfGl9n.jpg" alt="Product thumbnail" class="w-full h-full object-cover" />
        </div>
        <div class="flex flex-col justify-between py-1">
          <h4 class="font-medium text-white line-clamp-2 leading-snug">Sony WH-1000XM5 Wireless Headphones</h4>
          <a href="#" class="inline-flex w-fit px-3 py-1.5 bg-white text-neutral-950 text-xs font-semibold rounded-lg mt-2">Get Deal</a>
        </div>
      </div>
    </div>
    <div class="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none -z-10"></div>
  </div>
</template>

<style>
.perspective-1000 { perspective: 1000px; }
</style>
