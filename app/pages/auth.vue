<script setup lang="ts">
import { ref } from 'vue'
import AuthProviderButton from '~/components/auth/AuthProviderButton.vue'

const loadingProvider = ref<'google' | 'apple' | null>(null)

const handleAuth = async (provider: 'google' | 'apple') => {
  loadingProvider.value = provider
  await new Promise(resolve => setTimeout(resolve, 800))
  if (import.meta.client) window.location.assign(`/dashboard?provider=${provider}`)
}

useHead({
  title: 'Login | Link by Code',
  meta: [{ name: 'description', content: 'Sign in with Google or Apple to manage your Link by Code dashboard.' }]
})
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-neutral-950 px-4 py-10 text-neutral-100">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -left-16 top-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-[90px]" />
      <div class="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px]" />
    </div>

    <div class="relative mx-auto flex min-h-[80vh] w-full max-w-md items-center">
      <section class="w-full rounded-3xl border border-white/12 bg-neutral-900/80 p-6 shadow-[0_28px_70px_-40px_rgba(99,102,241,0.9)] backdrop-blur-xl sm:p-7">
        <NuxtLink to="/" class="mb-6 inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white">
          <span class="text-lg">#</span> Link by Code
        </NuxtLink>
        <h1 class="text-2xl font-bold text-white">Welcome back</h1>
        <p class="mt-1 text-sm text-neutral-400">Continue with your preferred provider.</p>

        <div class="mt-6 space-y-3">
          <AuthProviderButton label="Continue with Google" provider="google" :loading="loadingProvider === 'google'" @select="handleAuth" />
          <AuthProviderButton label="Continue with Apple" provider="apple" :loading="loadingProvider === 'apple'" @select="handleAuth" />
        </div>

        <p class="mt-6 text-center text-xs text-neutral-500">By continuing, you agree to our Terms and Privacy Policy.</p>
      </section>
    </div>
  </div>
</template>
