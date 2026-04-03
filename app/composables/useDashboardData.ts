import type { BillingSubscription } from '~/types/billing'
import type { DashboardLink, ProfileSettings } from '~/types/dashboard'
import { profileService } from '~/services/profile.service'
import { defaultBillingSubscriptionState, mapMeSubscriptionToBilling } from '~/utils/subscriptionFromMe'

interface LinkInput {
  code?: string
  title: string
  description: string
  image: string
  url: string
}

export const useDashboardData = () => {
  const links = useState<DashboardLink[]>('dashboard-links', () => [])
  const profile = useState<ProfileSettings>('dashboard-profile', () => ({
    username: '',
    bio: '',
    avatar: ''
  }))
  const currentUserId = useState<string>('dashboard-user-id', () => '')
  const profileLoading = useState<boolean>('dashboard-profile-loading', () => false)
  const profileLoaded = useState<boolean>('dashboard-profile-loaded', () => false)

  const subscription = useState<BillingSubscription>('billing-subscription', () => ({
    ...defaultBillingSubscriptionState
  }))

  const totalClicks = computed(() => links.value.reduce((sum, link) => sum + link.clicks, 0))
  const recentLinks = computed(() => [...links.value].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5))

  const generateCode = () => String(Math.floor(1000 + Math.random() * 9000))

  const fetchMetadata = async (url: string) => {
    if (!url.startsWith('http')) throw new Error('Invalid URL')
    const host = new URL(url).hostname.replace('www.', '')
    await new Promise(resolve => setTimeout(resolve, 700))
    return {
      title: `Product from ${host}`,
      description: `Auto-fetched metadata for ${host}`,
      image: `https://picsum.photos/seed/${encodeURIComponent(host)}/300/200`
    }
  }

  const upsertLink = (input: LinkInput, currentId?: string) => {
    const code = input.code?.trim() || generateCode()
    const normalized: DashboardLink = {
      id: currentId ?? String(Date.now()),
      code,
      title: input.title.trim(),
      description: input.description.trim(),
      image: input.image.trim(),
      url: input.url.trim(),
      clicks: currentId ? links.value.find(link => link.id === currentId)?.clicks || 0 : 0,
      createdAt: currentId ? links.value.find(link => link.id === currentId)?.createdAt || new Date().toISOString() : new Date().toISOString()
    }
    const index = links.value.findIndex(link => link.id === normalized.id)
    if (index === -1) links.value = [normalized, ...links.value]
    else links.value[index] = normalized
  }

  const deleteLink = (id: string) => {
    links.value = links.value.filter(link => link.id !== id)
  }

  const loadMyProfile = async (force = false) => {
    if (profileLoading.value && !force) return
    if (profileLoaded.value && !force) return

    const { accessToken } = useAuthSession()
    if (!accessToken.value) {
      currentUserId.value = ''
      profile.value = { username: '', bio: '', avatar: '' }
      profileLoaded.value = false
      subscription.value = { ...defaultBillingSubscriptionState }
      return
    }

    profileLoading.value = true
    try {
      const response = await profileService.getMe()
      const userData = response.data?.user
      const profileData = response.data?.profile
      const config = useRuntimeConfig()
      const monthly = String(config.public.billingProMonthlyLabel || '$1.99/mo')
      const yearly = String(config.public.billingProYearlyLabel || '$15.99/yr')
      currentUserId.value = userData?.id || ''
      profile.value = {
        username: profileData?.username || '',
        bio: profileData?.bio || '',
        avatar: profileData?.avatarUrl || userData?.avatarUrl || ''
      }
      subscription.value = mapMeSubscriptionToBilling(response.data?.subscription, monthly, yearly)
      profileLoaded.value = true
    } finally {
      profileLoading.value = false
    }
  }

  return {
    links,
    profile,
    subscription,
    currentUserId,
    profileLoading,
    profileLoaded,
    totalClicks,
    recentLinks,
    generateCode,
    fetchMetadata,
    upsertLink,
    deleteLink,
    loadMyProfile
  }
}
