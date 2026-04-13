<script setup lang="ts">
import type { HowItWorksFetchGuide } from './types'

defineProps<{
  guide: HowItWorksFetchGuide
}>()
</script>

<template>
  <section
    class="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900 sm:p-6"
  >
    <h3 class="text-base font-semibold text-neutral-900 dark:text-white">
      {{ guide.title }}
    </h3>
    <div class="mt-3 space-y-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
      <p v-for="(paragraph, idx) in guide.intro" :key="idx">
        {{ paragraph }}
      </p>
    </div>

    <div class="mt-6 grid gap-6 lg:grid-cols-2">
      <figure class="space-y-2">
        <div
          class="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-neutral-950"
        >
          <img
            :src="guide.imageSuccessSrc"
            alt="Product URL field and Fetch button"
            class="h-auto w-full object-contain object-top"
            loading="lazy"
            decoding="async"
          >
        </div>
        <figcaption class="text-xs text-neutral-500 dark:text-neutral-400">
          {{ guide.successCaption }}
        </figcaption>
      </figure>

      <figure class="space-y-2">
        <div
          class="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-neutral-950"
        >
          <img
            :src="guide.imageFailSrc"
            alt="Could not fetch metadata message"
            class="h-auto w-full object-contain object-top"
            loading="lazy"
            decoding="async"
          >
        </div>
        <figcaption class="text-xs text-neutral-500 dark:text-neutral-400">
          {{ guide.failCaption }}
        </figcaption>
      </figure>
    </div>
  </section>
</template>
