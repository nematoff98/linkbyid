import type { $Fetch } from 'ofetch'
import type { BillingSubscriptionApiResponse, BillingTransactionApi } from '~/types/billing'

/** Call `useApi()` at setup time; avoid awaiting before it (e.g. inside async watch). */
export async function billingFetchSubscription(api: $Fetch, userId: string) {
  return api<{ data: BillingSubscriptionApiResponse }>(
    `/billing/subscription/${encodeURIComponent(userId)}`,
    { method: 'GET' }
  )
}

export async function billingFetchTransactions(api: $Fetch) {
  const raw = await api<unknown>('/billing/transactions', { method: 'GET' })
  return unwrapTransactionsList(raw)
}

function unwrapTransactionsList(raw: unknown): BillingTransactionApi[] {
  if (Array.isArray(raw)) return raw as BillingTransactionApi[]
  if (raw && typeof raw === 'object' && 'data' in raw) {
    const d = (raw as { data: unknown }).data
    if (Array.isArray(d)) return d as BillingTransactionApi[]
  }
  return []
}

export interface CheckoutSessionResponse {
  data: { checkoutUrl: string }
}

function unwrapCheckoutUrl(response: unknown): string | null {
  if (!response || typeof response !== 'object') return null
  const r = response as Record<string, unknown>
  const inner = r.data
  if (inner && typeof inner === 'object') {
    const url = (inner as Record<string, unknown>).checkoutUrl
    if (typeof url === 'string' && url.length > 0) return url
  }
  if (typeof r.checkoutUrl === 'string' && r.checkoutUrl.length > 0) return r.checkoutUrl
  return null
}

function unwrapPortalUrl(response: unknown): string | null {
  if (!response || typeof response !== 'object') return null
  const r = response as Record<string, unknown>
  const inner = r.data
  if (inner && typeof inner === 'object') {
    const url = (inner as Record<string, unknown>).portalUrl
    if (typeof url === 'string' && url.length > 0) return url
  }
  if (typeof r.portalUrl === 'string' && r.portalUrl.length > 0) return r.portalUrl
  return null
}

export const billingService = {
  async getSubscription(userId: string) {
    const api = useApi()
    return billingFetchSubscription(api, userId)
  },

  /**
   * POST /api/billing/checkout — { priceId }
   * Javob: { data: { checkoutUrl } }
   */
  async createCheckoutSession(priceId: string) {
    const api = useApi()
    const raw = await api<CheckoutSessionResponse | Record<string, unknown>>('/billing/checkout', {
      method: 'POST',
      body: { priceId }
    })
    const checkoutUrl = unwrapCheckoutUrl(raw)
    return { checkoutUrl, raw }
  },

  /**
   * POST /api/billing/portal — body `{}`
   * Javob: { data: { portalUrl } }
   */
  async createPortalSession() {
    const api = useApi()
    const raw = await api<{ data: { portalUrl: string } } | Record<string, unknown>>('/billing/portal', {
      method: 'POST',
      body: {}
    })
    const portalUrl = unwrapPortalUrl(raw)
    return { portalUrl, raw }
  },

  /** GET /api/billing/transactions — massiv yoki { data: [...] } */
  async getTransactions() {
    const api = useApi()
    return billingFetchTransactions(api)
  }
}
