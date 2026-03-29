<script setup lang="ts">
const features = [
  {
    title: 'Code-based Access',
    description: 'Transform complex URLs into 4-digit codes. Simple to say on video, simple to type.',
    icon: '0101'
  },
  {
    title: 'Link in Bio Page',
    description: 'A beautiful landing page for your audience. One central hub for all your product recommendations.',
    icon: 'link'
  },
  {
    title: 'Smart Search',
    description: 'Instant autocomplete matching codes and keywords directly from your custom bio link.',
    icon: 'search'
  },
  {
    title: 'Analytics Dashboard',
    description: 'Track clicks, searches, and top-performing codes. See what products your audience loves.',
    icon: 'chart'
  },
  {
    title: 'Fast Redirects',
    description: 'Zero-latency forwarding. Visitors land on your affiliate link instantly without annoying waiting screens.',
    icon: 'zap'
  },
  {
    title: 'Mobile Optimized',
    description: 'Looks perfect pixel-for-pixel on every device. Fully responsive designs that convert everywhere.',
    icon: 'mobile'
  }
]
</script>

<template>
  <section id="features" class="w-full py-16">
    <div class="text-center max-w-2xl mx-auto mb-16 space-y-4">
      <h2 class="text-indigo-400 font-semibold tracking-wide uppercase text-sm">Features</h2>
      <h3 class="text-3xl md:text-5xl font-bold text-white tracking-tight">Everything a modern creator needs</h3>
      <p class="text-neutral-400 text-lg">Powerful tools built into a minimalistic platform. Manage links faster and sell more effectively.</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="(feature, idx) in features" 
        :key="idx"
        class="group p-8 rounded-[2rem] bg-neutral-900 border border-neutral-800 transition-all hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-2xl hover:bg-neutral-800/80 hover:shadow-indigo-500/10"
      >
        <div class="w-14 h-14 rounded-2xl bg-neutral-950 flex items-center justify-center mb-6 shadow-md shadow-neutral-950 border border-neutral-800/80 group-hover:border-indigo-500/30 transition-colors">
          <svg v-if="feature.icon === '0101'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <svg v-else-if="feature.icon === 'link'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-400"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          <svg v-else-if="feature.icon === 'search'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <svg v-else-if="feature.icon === 'chart'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-400"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
          <svg v-else-if="feature.icon === 'zap'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-400"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          <svg v-else-if="feature.icon === 'mobile'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-400"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
        </div>
        <h4 class="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">{{ feature.title }}</h4>
        <p class="text-neutral-400 leading-relaxed text-sm">
          {{ feature.description }}
        </p>
      </div>
    </div>
  </section>
</template>
