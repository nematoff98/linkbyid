<script setup lang="ts">
</script>

<template>
  <section id="about" class="w-full py-12 md:py-20 scroll-mt-24">
    <div
      class="relative overflow-hidden rounded-[2rem] border border-neutral-800 bg-neutral-900/40 p-8 sm:p-10 md:p-14 lg:p-16 shadow-2xl shadow-black/20"
    >
      <!-- Soft glow + grid (matches FinalCta / landing language) -->
      <div
        class="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-indigo-500/25 to-transparent"
        aria-hidden="true"
      />

      <div class="relative z-10 mx-auto max-w-3xl">
        <div class="mb-8 md:mb-10 text-center md:text-left">
          <p class="text-sm font-semibold uppercase tracking-wider text-indigo-400">
            About / Explanation
          </p>
          <h2 class="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            Codes instead of clutter
          </h2>
        </div>

        <div class="space-y-6 text-pretty">
          <p class="text-lg leading-relaxed text-neutral-200 sm:text-xl">
            Link by Code helps creators share products using simple codes instead of long links.
          </p>
          <p class="leading-relaxed text-neutral-400">
            Instead of placing messy URLs in your bio, you can give your audience a short code to search.
            This makes your content cleaner and easier to use.
          </p>
          <p class="leading-relaxed text-neutral-400">
            Perfect for TikTok, Instagram, and modern creators who want fast and simple product sharing.
          </p>
        </div>

        <div
          class="mt-10 flex flex-wrap items-center justify-center gap-2 md:justify-start"
          aria-hidden="true"
        >
          <span
            class="rounded-full border border-neutral-700/80 bg-neutral-950/80 px-3 py-1 text-xs font-medium text-neutral-300"
          >TikTok</span>
          <span
            class="rounded-full border border-neutral-700/80 bg-neutral-950/80 px-3 py-1 text-xs font-medium text-neutral-300"
          >Instagram</span>
          <span
            class="rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-200"
          >Creators</span>
        </div>
      </div>
    </div>
  </section>
</template>
