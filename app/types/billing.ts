export type PlanType = 'free' | 'pro'

export type BillingStatusApi = 'active' | 'inactive'

// Backend’ning `/billing/subscription/{userId}` javob formatiga mos keladi.
export interface BillingSubscriptionApiResponse {
  id: string
  userId: string
  plan: PlanType
  billingCycle: 'monthly' | string
  status: BillingStatusApi
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  currentPeriodEnd: string | null
  createdAt: string
}

export interface BillingSubscription {
  plan: PlanType
  priceLabel: string
  expiryDate: string | null
  status: BillingStatusApi
}

export interface BillingPayment {
  id: number
  date: string
  amount: string
  plan: string
  status: 'paid' | 'failed'
}
