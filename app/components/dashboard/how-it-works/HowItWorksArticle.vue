<script setup lang="ts">
defineProps<{
  title: string
  body: string[]
  imageSrc: string
  imageAlt: string
}>()
</script>

<template>
  <article
    class="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900 sm:p-6"
  >
    <h3 class="text-base font-semibold text-neutral-900 dark:text-white">
      {{ title }}
    </h3>
    <div class="mt-3 space-y-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
      <p v-for="(paragraph, idx) in body" :key="idx">
        {{ paragraph }}
      </p>
    </div>
    <div
      class="mt-5 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-neutral-950"
    >
      <img
        :src="imageSrc"
        :alt="imageAlt"
        class="h-auto w-full object-contain object-top"
        loading="lazy"
        decoding="async"
      >
    </div>
  </article>
</template>
