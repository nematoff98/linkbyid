<script setup lang="ts">
import Navbar from '~/components/landing/Navbar.vue'
import Hero from '~/components/landing/Hero.vue'
import HowItWorks from '~/components/landing/HowItWorks.vue'
import Features from '~/components/landing/Features.vue'
import Demo from '~/components/landing/Demo.vue'
import Pricing from '~/components/landing/Pricing.vue'
import Faq from '~/components/landing/Faq.vue'
import FinalCta from '~/components/landing/FinalCta.vue'
import Footer from '~/components/landing/Footer.vue'

useHead({
  title: "Find Products by Code – Link by Code",
  meta: [
    {
      name: "description",
      content:
        "Find products instantly by code or name. Perfect for TikTok, Instagram, and creators. No links needed. Just type the code.",
    },
    {
      name: "keywords",
      content:
        "find product by code, tiktok product finder, instagram product search, link alternative, creator tools",
    },
    {
      property: "og:title",
      content: "Find Products by Code – Link by Code",
    },
    {
      property: "og:description",
      content:
        "No links? No problem. Just type the code and find the product instantly.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:image",
      content: "https://yourdomain.com/og-image.png",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
  ],
});
</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-neutral-50 overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-white">
    <!-- Subtle gradient background -->
    <div class="fixed inset-0 z-0 flex justify-center pointer-events-none overflow-hidden">
      <div class="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30 blur-[100px] bg-gradient-to-b from-indigo-500/50 via-purple-500/20 to-transparent rounded-full" />
    </div>

    <div class="relative z-10 flex flex-col min-h-screen">
      <Navbar />
      <main class="flex-1 w-full flex flex-col items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24 md:space-y-32 pb-32">
        <Hero />
        <HowItWorks />
        <Features />
        <Demo />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
html, body {
  font-family: 'Inter', sans-serif;
  background-color: #0a0a0a;
  color: #fafafa;
}
html { scroll-behavior: smooth; }
</style>
