import type { AuthSessionPayload } from '~/composables/useAuthSession'

interface OAuthResponse {
  data: AuthSessionPayload
}

export const authService = {
  async oauthCallback(provider: 'google' | 'apple', email: string) {
    const api = useApi()
    const endpoint = provider === 'google' ? '/auth/oauth/google/callback' : '/auth/oauth/apple/callback'
    return await api<OAuthResponse>(endpoint, { method: 'GET', query: { email } })
  }
}
