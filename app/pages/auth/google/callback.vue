<script setup lang="ts">
import { onMounted, ref } from 'vue'

const loadingText = ref('Google orqali kirish yakunlanmoqda...')
const { setTokens, clearSession } = useAuthSession()

onMounted(async () => {
  const route = useRoute()
  const error = typeof route.query.error === 'string' ? route.query.error : ''
  if (error) {
    clearSession()
    loadingText.value = decodeURIComponent(error)
    await navigateTo('/auth', { replace: true })
    return
  }

  const hash = window.location.hash.replace(/^#/, '')
  if (!hash) {
    clearSession()
    loadingText.value = "Noto'g'ri callback"
    await navigateTo('/auth', { replace: true })
    return
  }

  const params = new URLSearchParams(hash)
  const accessToken = params.get('access_token') || ''
  const refreshToken = params.get('refresh_token') || ''
  const provider = params.get('provider')

  if (!accessToken || !refreshToken || (provider !== 'google' && provider !== 'apple')) {
    clearSession()
    loadingText.value = "Noto'g'ri callback"
    await navigateTo('/auth', { replace: true })
    return
  }

  setTokens({ accessToken, refreshToken, provider })
  window.history.replaceState({}, document.title, window.location.pathname)
  await navigateTo('/dashboard', { replace: true })
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-neutral-100">
    <p class="text-sm text-neutral-300">{{ loadingText }}</p>
  </div>
</template>
