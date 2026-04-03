export type PlanType = 'free' | 'pro'

export type BillingStatusApi = 'active' | 'inactive'

/** GET `/billing/subscription/{userId}` → `data` (Billing page uses this; `/profiles/me` drives global nav/roles). */
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
  /** Billing cycle from API (e.g. monthly / yearly) */
  billingCycle?: string | null
}

/** GET /billing/transactions row (Stripe invoice) */
export interface BillingTransactionApi {
  id: string
  number: string
  amountPaid: number
  currency: string
  status: string
  hostedInvoiceUrl: string
  invoicePdf: string
  created: string
  periodStart: string
  periodEnd: string
}

/** Table row for payment history */
export interface BillingPayment {
  id: string
  date: string
  invoiceNumber: string
  amountLabel: string
  status: string
  hostedInvoiceUrl: string
  invoicePdf: string
}
