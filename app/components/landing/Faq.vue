<script setup lang="ts">
import { ref } from 'vue'

const faqs = [
  {
    question: 'What is Link by Code?',
    answer: 'Link by Code is a tool that allows creators to turn long, messy product links into simple, memorable codes—letters, numbers, or both, in a format that fits your workflow. Instead of asking followers to clunkily navigate deep into your Linktree, they just enter the code on your bio link and go straight to the product.'
  },
  {
    question: 'How does the code system work?',
    answer: 'When you paste a URL into our dashboard, we pair it with a short code for that product. You share this code on your videos. Users go to your bio link, type it into the search bar, and get instantly redirected.'
  },
  {
    question: 'Can I customize my codes?',
    answer: 'Yes. Pro gives you the most flexibility to choose and manage custom codes (like "CAMERA" or "SETUP")—letters, numbers, or both—so they match your branding or campaigns.'
  },
  {
    question: 'Is it really free?',
    answer: 'Yes! Our free plan gives you up to 10 active links and basic analytics forever. It’s perfect for creators who are just starting out. You can upgrade to Pro when you need unlimited links.'
  }
]

const openFaq = ref<number | null>(0)

const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index
}
</script>

<template>
  <section id="faq" class="w-full py-16">
    <div class="text-center max-w-2xl mx-auto mb-16 space-y-4">
      <h2 class="text-indigo-400 font-semibold tracking-wide uppercase text-sm">FAQ</h2>
      <h3 class="text-3xl md:text-5xl font-bold text-white tracking-tight">Got questions?</h3>
      <p class="text-neutral-400 text-lg">Everything you need to know about the product and how it works.</p>
    </div>

    <div class="max-w-3xl mx-auto w-full space-y-4">
      <div 
        v-for="(faq, idx) in faqs" 
        :key="idx"
        class="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden transition-all duration-300"
        :class="openFaq === idx ? 'border-indigo-500/30 bg-neutral-800/50 shadow-lg shadow-indigo-500/5' : 'hover:border-neutral-700 hover:bg-neutral-800/30'"
      >
        <button 
          @click="toggleFaq(idx)"
          class="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
        >
          <h4 class="text-lg font-semibold text-white pr-8">{{ faq.question }}</h4>
          <div 
            class="w-8 h-8 rounded-full bg-neutral-950 flex items-center justify-center border border-neutral-800 flex-shrink-0 transition-transform duration-300 text-neutral-400"
            :class="openFaq === idx ? 'rotate-180 bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : ''"
          >
            <svg v-if="openFaq === idx" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </button>
        
        <div 
          class="grid transition-all duration-300 ease-in-out"
          :class="openFaq === idx ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
        >
          <div class="overflow-hidden">
            <p class="p-6 md:p-8 pt-0 text-neutral-400 leading-relaxed max-w-2xl">
              {{ faq.answer }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
