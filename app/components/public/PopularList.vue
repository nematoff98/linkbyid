<script setup lang="ts">
import ProductCard from './ProductCard.vue'
import type { Product } from './ProductCard.vue'

defineProps<{ products: Product[] }>()
</script>

<template>
  <div class="w-full flex flex-col gap-3">
    <ProductCard 
      v-for="product in products" 
      :key="product.id" 
      :product="product" 
    />
  </div>
</template>
