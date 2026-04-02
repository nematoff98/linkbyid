import type { $Fetch } from 'ofetch'
import { AUTH_COOKIE_KEYS } from '~/constants/auth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const redirectingToAuth = useState('redirecting-to-auth', () => false)
  const baseURL = `${config.public.apiBase}/api`.replace(/([^:]\/)\/+/g, '$1')
  const api: $Fetch = $fetch.create({
    baseURL,
    onRequest({ request, options }) {
      const accessToken = useCookie<string | null>(AUTH_COOKIE_KEYS.accessToken).value
      const headers = new Headers(options.headers as HeadersInit | undefined)
      headers.set('Accept', 'application/json')
      const requestUrl = typeof request === 'string'
        ? request
        : request instanceof Request
          ? request.url
          : String(request)
      const isGoogleStart = requestUrl.includes('/auth/oauth/google') || requestUrl.includes('/api/auth/oauth/google')
      if (accessToken && !isGoogleStart) headers.set('Authorization', `Bearer ${accessToken}`)
      options.headers = headers
    },
    async onResponseError({ response }) {
      if (response.status !== 401) return
      useCookie<string | null>(AUTH_COOKIE_KEYS.accessToken).value = null
      useCookie<string | null>(AUTH_COOKIE_KEYS.refreshToken).value = null
      useCookie<string | null>(AUTH_COOKIE_KEYS.provider).value = null
      useCookie<string | null>(AUTH_COOKIE_KEYS.userId).value = null
      if (!import.meta.client || redirectingToAuth.value) return
      const route = useRoute()
      if (!route.path.startsWith('/dashboard')) return
      if (route.path.startsWith('/auth')) return
      redirectingToAuth.value = true
      try {
        await navigateTo('/auth')
      } finally {
        redirectingToAuth.value = false
      }
    }
  })

  return { provide: { api } }
})
