import type { DashboardLink, ProfileSettings } from '~/types/dashboard'

interface LinkInput {
  code?: string
  title: string
  description: string
  image: string
  url: string
}

const seedLinks: DashboardLink[] = [{
  id: 1,
  code: '8472',
  title: 'iPhone 15 Pro',
  description: 'Latest Apple flagship',
  image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS7JowFXLnk_5fjXAkgYPNQDnY8u1-KyxRYFktqievkFmqJOnOER1oxUqsOkqfs10Pe4nBRVag4jS2yPJV3Jc4Opnik_mJqNoDN7RM9lwIhos0lFJhFbq_sr0utueHcuKfSrZYhkTJcs-M&usqp=CAc',
  url: 'https://example.com',
  clicks: 124,
  createdAt: new Date().toISOString()
}]

export const useDashboardData = () => {
  const links = useState<DashboardLink[]>('dashboard-links', () => [...seedLinks])
  const profile = useState<ProfileSettings>('dashboard-profile', () => ({
    username: 'creator_name',
    bio: 'I share curated products from my videos.',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI3J8NKYVOAuvW7i5ndqRz3znDPK6ts3W8QA&s'
  }))

  const totalClicks = computed(() => links.value.reduce((sum, link) => sum + link.clicks, 0))
  const recentLinks = computed(() => [...links.value].sort((a, b) => b.id - a.id).slice(0, 5))

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

  const upsertLink = (input: LinkInput, currentId?: number) => {
    const code = input.code?.trim() || generateCode()
    const normalized: DashboardLink = {
      id: currentId ?? Date.now(),
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

  const deleteLink = (id: number) => {
    links.value = links.value.filter(link => link.id !== id)
  }

  return { links, profile, totalClicks, recentLinks, generateCode, fetchMetadata, upsertLink, deleteLink }
}
