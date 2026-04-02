import { AUTH_COOKIE_KEYS } from '~/constants/auth'

export interface AuthSessionPayload {
  userId?: string
  accessToken: string
  refreshToken: string
  provider: 'google' | 'apple'
}

export const useAuthSession = () => {
  const accessToken = useCookie<string | null>(AUTH_COOKIE_KEYS.accessToken, { sameSite: 'lax' })
  const refreshToken = useCookie<string | null>(AUTH_COOKIE_KEYS.refreshToken, { sameSite: 'lax' })
  const provider = useCookie<'google' | 'apple' | null>(AUTH_COOKIE_KEYS.provider, { sameSite: 'lax' })
  const userId = useCookie<string | null>(AUTH_COOKIE_KEYS.userId, { sameSite: 'lax' })

  const setSession = (payload: AuthSessionPayload) => {
    accessToken.value = payload.accessToken
    refreshToken.value = payload.refreshToken
    provider.value = payload.provider
    userId.value = payload.userId || userId.value
  }

  const setTokens = (payload: Pick<AuthSessionPayload, 'accessToken' | 'refreshToken' | 'provider'> & { userId?: string }) => {
    accessToken.value = payload.accessToken
    refreshToken.value = payload.refreshToken
    provider.value = payload.provider
    if (payload.userId) userId.value = payload.userId
  }

  const clearSession = () => {
    accessToken.value = null
    refreshToken.value = null
    provider.value = null
    userId.value = null
  }

  return { accessToken, refreshToken, provider, userId, setSession, setTokens, clearSession }
}
