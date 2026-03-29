export type PlanType = 'free' | 'pro'

export interface BillingSubscription {
  plan: PlanType
  priceLabel: string
  expiryDate: string | null
  status: 'active' | 'inactive'
}

export interface BillingPayment {
  id: number
  date: string
  amount: string
  plan: string
  status: 'paid' | 'failed'
}
