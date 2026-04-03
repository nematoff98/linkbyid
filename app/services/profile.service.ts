export interface MeResponse {
  data: {
    user: {
      id: string
      email: string
      fullName: string
      avatarUrl?: string | null
    }
    profile: {
      id?: string
      userId?: string
      username?: string | null
      bio?: string | null
      avatarUrl?: string | null
      createdAt?: string
    } | null
    /** Plan & billing summary (same source as sidebar / pro gates). */
    subscription?: {
      plan: 'free' | 'pro'
      billing_cycle?: string | null
      status?: string
      source?: string
      current_period_end?: string | null
    } | null
  }
}

interface UpdateProfileInput {
  username: string
  bio?: string
  avatarUrl?: string
  avatar?: File | null
}

interface PublicProfileByUsernameResponse {
  data?: {
    username?: string
    bio?: string
    avatarUrl?: string
    /** When set to `free`, theme toggle is hidden on the public profile. */
    plan?: 'free' | 'pro'
  }
}

export const profileService = {
  async getMe() {
    const api = useApi()
    return await api<MeResponse>('/profiles/me', { method: 'GET' })
  },
  async updateProfile(userId: string, payload: UpdateProfileInput) {
    const api = useApi()
    const formData = new FormData()
    formData.append('username', payload.username)
    if (payload.bio) formData.append('bio', payload.bio)
    if (payload.avatar) formData.append('avatar', payload.avatar)
    else if (payload.avatarUrl) formData.append('avatarUrl', payload.avatarUrl)
    return await api(`/profiles/${userId}`, { method: 'PUT', body: formData })
  },
  async getByUsername(username: string) {
    const api = useApi()
    const response = await api<PublicProfileByUsernameResponse>(`/profiles/by-username/${encodeURIComponent(username)}`, { method: 'GET' })
    const plan = response?.data?.plan
    return {
      username: response?.data?.username || username,
      bio: response?.data?.bio || '',
      avatarUrl: response?.data?.avatarUrl || '',
      plan: plan === 'free' || plan === 'pro' ? plan : undefined
    }
  }
}
