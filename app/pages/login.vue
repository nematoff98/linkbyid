<script setup lang="ts">
const route = useRoute()
const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
await navigateTo({ path: '/auth', query: redirect ? { redirect } : {} }, { replace: true })
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-300">
    <p class="text-sm">Redirecting…</p>
  </div>
</template>
