<script setup lang="ts">
import type { TicketBlock } from '~/types/ticket'

defineProps<{
  blocks: TicketBlock[]
}>()
</script>

<template>
  <div class="space-y-3">
    <template v-for="(block, idx) in blocks" :key="idx">
      <p
        v-if="block.type === 'text' && block.text?.trim()"
        class="whitespace-pre-wrap text-sm text-neutral-800 dark:text-neutral-100"
      >
        {{ block.text }}
      </p>
      <figure v-if="block.type === 'text' && block.url?.trim()" class="overflow-hidden rounded-lg border border-neutral-200 dark:border-white/10">
        <img :src="block.url" :alt="block.alt || ''" class="max-h-64 w-full object-contain bg-neutral-50 dark:bg-neutral-800/50">
        <figcaption v-if="block.alt?.trim()" class="px-2 py-1 text-xs text-neutral-500 dark:text-neutral-400">{{ block.alt }}</figcaption>
      </figure>
      <figure v-if="block.type === 'image' && block.url?.trim()" class="overflow-hidden rounded-lg border border-neutral-200 dark:border-white/10">
        <img :src="block.url" :alt="block.alt || ''" class="max-h-64 w-full object-contain bg-neutral-50 dark:bg-neutral-800/50">
        <figcaption v-if="block.alt?.trim()" class="px-2 py-1 text-xs text-neutral-500 dark:text-neutral-400">{{ block.alt }}</figcaption>
      </figure>
    </template>
  </div>
</template>
