import type { TicketBlockPayload, TicketDetail, TicketListItem } from '~/types/ticket'

interface TicketsListEnvelope {
  data?: { items: TicketListItem[]; total: number }
}

interface TicketDetailEnvelope {
  data?: TicketDetail
}

interface UploadImageResponse {
  url?: string
  data?: { url?: string }
}

function unwrapList(raw: TicketsListEnvelope | { items?: TicketListItem[]; total?: number }) {
  const payload = 'data' in raw && raw.data ? raw.data : raw
  const items = Array.isArray(payload?.items) ? payload.items : []
  const total = typeof payload?.total === 'number' ? payload.total : 0
  return { items, total }
}

function unwrapDetail(raw: TicketDetailEnvelope | TicketDetail): TicketDetail {
  if (raw && typeof raw === 'object' && 'data' in raw && raw.data) return raw.data
  return raw as TicketDetail
}

export const ticketsService = {
  async list(page = 1, limit = 10) {
    const api = useApi()
    const raw = await api<TicketsListEnvelope | { items?: TicketListItem[]; total?: number }>('/tickets', {
      method: 'GET',
      query: { page, limit }
    })
    return unwrapList(raw)
  },

  async getById(id: string) {
    const api = useApi()
    const raw = await api<TicketDetailEnvelope | TicketDetail>(`/tickets/${id}`, { method: 'GET' })
    return unwrapDetail(raw)
  },

  async create(body: { subject: string; blocks: TicketBlockPayload[] }) {
    const api = useApi()
    return await api(`/tickets`, { method: 'POST', body })
  },

  async uploadImage(file: File) {
    const api = useApi()
    const body = new FormData()
    body.append('image', file)
    const raw = await api<UploadImageResponse>('/tickets/upload-image', { method: 'POST', body })
    const url = raw?.url ?? raw?.data?.url
    if (!url?.trim()) throw new Error('Upload did not return a URL.')
    return url
  },

  async deleteUploadedImage(url: string) {
    const api = useApi()
    await api('/tickets/upload-image', { method: 'DELETE', body: { url } })
  },

  async addMessage(ticketId: string, blocks: TicketBlockPayload[]) {
    const api = useApi()
    return await api(`/tickets/${ticketId}/messages`, { method: 'POST', body: { blocks } })
  },

  async close(ticketId: string) {
    const api = useApi()
    return await api(`/tickets/${ticketId}/close`, { method: 'PATCH' })
  }
}
