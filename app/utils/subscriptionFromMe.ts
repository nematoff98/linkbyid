import type { BillingStatusApi, BillingSubscription, BillingSubscriptionApiResponse, PlanType } from '~/types/billing'

/** Shape from GET /profiles/me → data.subscription */
export interface MeSubscriptionPayload {
  plan: PlanType
  billing_cycle?: string | null
  status?: string
  source?: string
  current_period_end?: string | null
}

export const defaultBillingSubscriptionState: BillingSubscription = {
  plan: 'free',
  priceLabel: '$0/month',
  expiryDate: null,
  status: 'active',
  billingCycle: null
}

function mapPriceLabel(
  plan: PlanType,
  billingCycle: string | null | undefined,
  monthlyDisplay: string,
  yearlyDisplay: string
): string {
  if (plan === 'free') return '$0/month'
  const c = (billingCycle || '').toLowerCase()
  if (c === 'yearly' || c === 'annual' || c === 'year') return yearlyDisplay
  return monthlyDisplay
}

/** GET /billing/subscription/:userId → `data` */
export function mapBillingSubscriptionApiToBilling(
  data: BillingSubscriptionApiResponse,
  monthlyDisplay: string,
  yearlyDisplay: string
): BillingSubscription {
  const plan: PlanType = data.plan === 'pro' ? 'pro' : 'free'
  const billingCycle = data.billingCycle ?? null
  const status: BillingStatusApi = data.status === 'inactive' ? 'inactive' : 'active'
  const expiryDate = data.currentPeriodEnd ? data.currentPeriodEnd.slice(0, 10) : null
  return {
    plan,
    priceLabel: mapPriceLabel(plan, billingCycle, monthlyDisplay, yearlyDisplay),
    expiryDate,
    status,
    billingCycle
  }
}

export function mapMeSubscriptionToBilling(
  sub: MeSubscriptionPayload | null | undefined,
  monthlyDisplay: string,
  yearlyDisplay: string
): BillingSubscription {
  if (!sub?.plan) {
    return { ...defaultBillingSubscriptionState }
  }
  const plan: PlanType = sub.plan === 'pro' ? 'pro' : 'free'
  const billingCycle = sub.billing_cycle ?? null
  const status: BillingStatusApi = sub.status === 'inactive' ? 'inactive' : 'active'
  const expiryDate = sub.current_period_end ? sub.current_period_end.slice(0, 10) : null
  return {
    plan,
    priceLabel: mapPriceLabel(plan, billingCycle, monthlyDisplay, yearlyDisplay),
    expiryDate,
    status,
    billingCycle
  }
}
