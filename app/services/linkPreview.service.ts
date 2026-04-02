import type { $Fetch } from 'ofetch'

export interface LinkPreviewPayload {
  title: string
  description: string
  imageUrl: string
}

function unwrapPayload(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (o.data && typeof o.data === 'object' && o.data !== null) return o.data as Record<string, unknown>
  return o
}

export function normalizeLinkPreview(raw: unknown): LinkPreviewPayload {
  const data = unwrapPayload(raw)
  if (!data) return { title: '', description: '', imageUrl: '' }
  const title = typeof data.title === 'string' ? data.title : ''
  const description = typeof data.description === 'string' ? data.description : ''
  const imageUrl = typeof data.imageUrl === 'string' ? data.imageUrl : ''
  return { title, description, imageUrl }
}

export async function fetchLinkPreview(api: $Fetch, url: string): Promise<unknown> {
  return await api<unknown>('/link-preview', {
    method: 'POST',
    body: { url }
  })
}
