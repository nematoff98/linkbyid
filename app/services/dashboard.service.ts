import type { BioLink, DashboardLink, LinkDisplayMode, ProfileSettings } from '~/types/dashboard'

export interface DashboardPayload {
  profile: ProfileSettings
  codeLinks: DashboardLink[]
  bioLinks: BioLink[]
  linksDisplayMode: LinkDisplayMode
}

export interface AnalyticsMeResponse {
  link_items_type: 'object'
  summary: {
    links_count: number
    total_clicks: number
    page_views: number
  }
  clicks_last_7_days: Array<{
    date: string
    count: number
  }>
  top_links_by_clicks: Array<{
    id: string
    userId: string
    code: string
    title: string
    description: string | null
    imageUrl: string | null
    url: string
    clickCount: number
    createdAt: string
  }>
  recent_links: Array<{
    id: string
    userId: string
    code: string
    title: string
    description: string | null
    imageUrl: string | null
    url: string
    clickCount: number
    createdAt: string
  }>
}

export const dashboardService = {
  async getDashboardState() {
    const api = useApi()
    return await api<{ data: DashboardPayload }>('/dashboard/state', { method: 'GET' })
  },
  async getMyAnalytics() {
    const api = useApi()
    const raw = await api<AnalyticsMeResponse | { data?: AnalyticsMeResponse }>('/analytics/me', { method: 'GET' })
    const payload = ('data' in raw && raw.data) ? raw.data : raw
    const normalizeLinks = (items: unknown) => {
      if (!Array.isArray(items)) return []
      return items.map((item, index) => {
        if (item && typeof item === 'object') {
          const obj = item as Record<string, unknown>
          return {
            id: String(obj.id || index),
            userId: String(obj.userId || ''),
            code: String(obj.code || ''),
            title: String(obj.title || 'Untitled'),
            description: typeof obj.description === 'string' ? obj.description : '',
            imageUrl: typeof obj.imageUrl === 'string' ? obj.imageUrl : '',
            url: String(obj.url || '#'),
            clickCount: Number(obj.clickCount || 0),
            createdAt: String(obj.createdAt || '')
          }
        }
        return {
          id: String(index),
          userId: '',
          code: '',
          title: String(item || 'Untitled'),
          description: '',
          imageUrl: '',
          url: '#',
          clickCount: 0,
          createdAt: ''
        }
      })
    }
    return {
      link_items_type: 'object' as const,
      summary: payload?.summary || { links_count: 0, total_clicks: 0, page_views: 0 },
      clicks_last_7_days: Array.isArray(payload?.clicks_last_7_days) ? payload.clicks_last_7_days : [],
      top_links_by_clicks: normalizeLinks(payload?.top_links_by_clicks),
      recent_links: normalizeLinks(payload?.recent_links)
    }
  }
}
