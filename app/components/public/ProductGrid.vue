<script setup lang="ts">
import ProductCard from './ProductCard.vue'
import type { Product } from './ProductCard.vue'

defineProps<{ products: Product[] }>()
</script>

<template>
  <div class="w-full">
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      <ProductCard 
        v-for="(product, idx) in products" 
        :key="product.id" 
        :product="product" 
        class="animate-in fade-in zoom-in-95 duration-500 fill-mode-both"
        :style="{ animationDelay: `${0.05 * idx}s` }"
      />
    </div>
  </div>
</template>
