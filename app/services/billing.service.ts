import type { BillingSubscriptionApiResponse } from '~/types/billing'

export const billingService = {
  async getSubscription(userId: string) {
    const api = useApi()
    // API base URL allaqachon `/api` prefix bilan beriladi (plugins/api.ts).
    return await api<{ data: BillingSubscriptionApiResponse }>(`/billing/subscription/${encodeURIComponent(userId)}`, { method: 'GET' })
  }
}

