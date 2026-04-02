import type { DashboardLink } from '~/types/dashboard'
import type { Product } from '~/components/public/ProductCard.vue'

interface LinksMeItem {
  id: string
  userId: string
  code: string
  title: string
  description: string
  imageUrl: string
  url: string
  clickCount: number
  createdAt: string
}

interface LinksMeResponse {
  items: LinksMeItem[]
  total: number
  page: number
  limit: number
  total_pages: number
}

interface LinksMeEnvelope {
  data?: LinksMeResponse
}

interface PublicSearchItem {
  id: string
  userId: string
  code: string
  title: string
  description: string | null
  imageUrl: string | null
  url: string
  clickCount: number
  createdAt: string
}

interface PublicSearchResponse {
  data?: PublicSearchItem[]
}

interface PopularLinksResponse {
  items?: PublicSearchItem[]
  data?: PublicSearchItem[] | { items?: PublicSearchItem[] }
}

export interface LinkFormPayload {
  userId: string
  url: string
  title?: string
  customCode?: string
  description?: string
  imageUrl?: string
  image?: File | null
}

const toDashboardLink = (item: LinksMeItem): DashboardLink => ({
  id: item.id,
  code: item.code,
  title: item.title,
  description: item.description,
  image: item.imageUrl,
  url: item.url,
  clicks: item.clickCount,
  createdAt: item.createdAt
})

export const linksService = {
  async getMyLinks(page = 1, limit = 10) {
    const api = useApi()
    const raw = await api<LinksMeResponse | LinksMeEnvelope>('/links/me', { method: 'GET', query: { page, limit } })
    const payload = ('data' in (raw as LinksMeEnvelope) && (raw as LinksMeEnvelope).data)
      ? (raw as LinksMeEnvelope).data!
      : (raw as LinksMeResponse)
    const items = Array.isArray(payload?.items) ? payload.items : []
    return {
      items: items.map(toDashboardLink),
      total: payload?.total || 0,
      page: payload?.page || page,
      limit: payload?.limit || limit,
      total_pages: payload?.total_pages || 1
    }
  },
  async createLink(payload: LinkFormPayload) {
    const api = useApi()
    const body = new FormData()
    body.append('userId', payload.userId)
    body.append('url', payload.url)
    if (payload.title) body.append('title', payload.title)
    if (payload.customCode) body.append('customCode', payload.customCode)
    if (payload.description) body.append('description', payload.description)
    if (payload.image) body.append('image', payload.image)
    else if (payload.imageUrl) body.append('imageUrl', payload.imageUrl)
    return await api('/links', { method: 'POST', body })
  },
  async updateLink(linkId: string, payload: Omit<LinkFormPayload, 'userId'>) {
    const api = useApi()
    const body = new FormData()
    if (payload.url) body.append('url', payload.url)
    if (payload.title) body.append('title', payload.title)
    if (payload.customCode) body.append('customCode', payload.customCode)
    if (payload.description) body.append('description', payload.description)
    if (payload.image) body.append('image', payload.image)
    else if (payload.imageUrl) body.append('imageUrl', payload.imageUrl)
    return await api(`/links/${linkId}`, { method: 'PATCH', body })
  },
  async deleteLink(linkId: string) {
    const api = useApi()
    return await api(`/links/${linkId}`, { method: 'DELETE' })
  },
  async searchPublicLinks(username: string, q: string) {
    const api = useApi()
    const response = await api<PublicSearchResponse>('/links/search', {
      method: 'GET',
      query: { username, q }
    })
    const items = Array.isArray(response?.data) ? response.data : []
    return items.map<Product>(item => ({
      id: item.id,
      userId: item.userId,
      code: item.code,
      title: item.title,
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      url: item.url
    }))
  },
  async getPopularLinks(username: string, page = 1, limit = 3) {
    const api = useApi()
    const response = await api<PopularLinksResponse>('/links/popular', {
      method: 'GET',
      query: { username, page, limit }
    })
    const fromRootItems = Array.isArray(response?.items) ? response.items : []
    const fromDataArray = Array.isArray(response?.data) ? response.data : []
    const fromDataItems = (!Array.isArray(response?.data) && response?.data && Array.isArray(response.data.items))
      ? response.data.items
      : []
    const items = fromRootItems.length ? fromRootItems : (fromDataArray.length ? fromDataArray : fromDataItems)
    return items.map<Product>(item => ({
      id: item.id,
      userId: item.userId,
      code: item.code,
      title: item.title,
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      url: item.url
    }))
  }
}
