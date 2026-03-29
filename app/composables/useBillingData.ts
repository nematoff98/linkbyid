import type { BillingPayment, BillingSubscription, PlanType } from '~/types/billing'

const defaultSubscription: BillingSubscription = {
  plan: 'free',
  priceLabel: '$0/month',
  expiryDate: null,
  status: 'active'
}

const defaultHistory: BillingPayment[] = [
  { id: 1, date: '2026-03-08', amount: '$5.00', plan: 'Pro', status: 'paid' },
  { id: 2, date: '2026-02-08', amount: '$5.00', plan: 'Pro', status: 'paid' }
]

export const useBillingData = () => {
  const subscription = useState<BillingSubscription>('billing-subscription', () => ({ ...defaultSubscription }))
  const payments = useState<BillingPayment[]>('billing-payments', () => [...defaultHistory])
  const actionLoading = ref(false)

  const actionLabel = computed(() => subscription.value.plan === 'free' ? 'Upgrade to Pro' : 'Manage subscription')

  const openStripe = async (plan: PlanType) => {
    actionLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 450))
    if (import.meta.client) window.location.assign(`https://checkout.stripe.com/pay/mock-linkbycode-${plan}`)
    actionLoading.value = false
  }

  const openBillingPortal = async () => {
    actionLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 350))
    if (import.meta.client) window.location.assign('https://billing.stripe.com/p/login/mock-linkbycode')
    actionLoading.value = false
  }

  const cancelSubscription = () => {
    subscription.value = { plan: 'free', priceLabel: '$0/month', expiryDate: null, status: 'active' }
  }

  return { subscription, payments, actionLoading, actionLabel, openStripe, openBillingPortal, cancelSubscription }
}
