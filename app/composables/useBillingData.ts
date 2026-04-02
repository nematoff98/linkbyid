import type { BillingPayment, BillingSubscription, BillingTransactionApi, PlanType } from '~/types/billing'
import { billingFetchSubscription, billingFetchTransactions, billingService } from '~/services/billing.service'
import { useAuthSession } from '~/composables/useAuthSession'
import { useDashboardData } from '~/composables/useDashboardData'
import { getUserIdFromAccessToken } from '~/utils/jwt'

export type BillingCycleChoice = 'monthly' | 'yearly'

const defaultSubscription: BillingSubscription = {
  plan: 'free',
  priceLabel: '$0/month',
  expiryDate: null,
  status: 'active',
  billingCycle: null
}

const defaultHistory: BillingPayment[] = []

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

function formatStripeAmount(amountPaid: number, currency: string) {
  const cur = currency.toUpperCase()
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: cur }).format(amountPaid / 100)
  } catch {
    return `${(amountPaid / 100).toFixed(2)} ${cur}`
  }
}

function mapTransactions(rows: BillingTransactionApi[]): BillingPayment[] {
  return rows.map(row => ({
    id: row.id,
    date: row.created.slice(0, 10),
    invoiceNumber: row.number,
    amountLabel: formatStripeAmount(row.amountPaid, row.currency),
    status: row.status,
    hostedInvoiceUrl: row.hostedInvoiceUrl,
    invoicePdf: row.invoicePdf
  }))
}

export const useBillingData = () => {
  const api = useApi()

  const subscription = useState<BillingSubscription>('billing-subscription', () => ({ ...defaultSubscription }))
  const payments = useState<BillingPayment[]>('billing-payments', () => [...defaultHistory])
  const actionLoading = ref(false)
  const checkoutError = ref('')

  const billingCycleChoice = useState<BillingCycleChoice>('billing-cycle-choice', () => 'monthly')

  const actionLabel = computed(() =>
    subscription.value.plan === 'free' ? 'Upgrade to Pro (Stripe)' : 'Manage subscription'
  )

  const subscriptionLoading = ref(false)
  const transactionsLoading = ref(false)
  const { userId: authUserId, accessToken } = useAuthSession()
  const { currentUserId, loadMyProfile } = useDashboardData()

  const config = useRuntimeConfig()

  const resolveUserId = (): string | null => {
    const fromState = authUserId.value || currentUserId.value
    if (fromState) return fromState
    return getUserIdFromAccessToken(accessToken.value || undefined)
  }

  const getPriceIdForChoice = (choice: BillingCycleChoice): string => {
    const monthly = String(config.public.stripePriceProMonthlyId || '').trim()
    const yearly = String(config.public.stripePriceProYearlyId || '').trim()
    return choice === 'monthly' ? monthly : yearly
  }

  const fetchSubscription = async (userId: string) => {
    subscriptionLoading.value = true
    try {
      const response = await billingFetchSubscription(api, userId)
      const data = response?.data
      if (!data) return

      const monthlyDisplay = String(config.public.billingProMonthlyLabel || '$1.99/mo')
      const yearlyDisplay = String(config.public.billingProYearlyLabel || '$15.99/yr')
      subscription.value = {
        plan: data.plan,
        priceLabel: mapPriceLabel(data.plan, data.billingCycle, monthlyDisplay, yearlyDisplay),
        expiryDate: data.currentPeriodEnd ? data.currentPeriodEnd.slice(0, 10) : null,
        status: data.status,
        billingCycle: data.billingCycle || null
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to load billing subscription:', e)
    } finally {
      subscriptionLoading.value = false
    }
  }

  const fetchTransactions = async () => {
    transactionsLoading.value = true
    try {
      const rows = await billingFetchTransactions(api)
      payments.value = mapTransactions(rows)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to load billing transactions:', e)
      payments.value = []
    } finally {
      transactionsLoading.value = false
    }
  }

  const loadBillingData = async () => {
    if (import.meta.server) return
    const token = accessToken.value
    const userId = resolveUserId()
    if (!token || !userId) {
      subscription.value = { ...defaultSubscription }
      payments.value = []
      return
    }
    if (!currentUserId.value) {
      await loadMyProfile().catch(() => {})
    }
    const id = resolveUserId()
    if (!id) return
    await Promise.all([fetchSubscription(id), fetchTransactions()])
  }

  const refreshSubscription = async () => {
    if (import.meta.server) return
    const id = resolveUserId()
    if (!id || !accessToken.value) return
    await Promise.all([fetchSubscription(id), fetchTransactions()])
  }

  const startProCheckout = async () => {
    checkoutError.value = ''
    if (!accessToken.value) {
      await navigateTo({ path: '/login', query: { redirect: '/dashboard/billing' } })
      return
    }
    const userId = resolveUserId()
    if (!userId) {
      checkoutError.value = 'User ID not found. Please sign in again.'
      return
    }
    const priceId = getPriceIdForChoice(billingCycleChoice.value)
    if (!priceId) {
      checkoutError.value = 'Stripe price ID is not configured. Check your environment variables.'
      return
    }

    actionLoading.value = true
    try {
      const { checkoutUrl } = await billingService.createCheckoutSession(priceId)
      if (checkoutUrl && import.meta.client) {
        window.location.href = checkoutUrl
        return
      }
      checkoutError.value = 'Could not get checkout URL.'
    } catch (e) {
      checkoutError.value = e instanceof Error ? e.message : 'Could not start checkout'
    } finally {
      actionLoading.value = false
    }
  }

  const openBillingPortal = async () => {
    checkoutError.value = ''
    if (!accessToken.value) {
      await navigateTo({ path: '/login', query: { redirect: '/dashboard/billing' } })
      return
    }
    actionLoading.value = true
    try {
      const { portalUrl } = await billingService.createPortalSession()
      if (portalUrl && import.meta.client) {
        window.location.href = portalUrl
        return
      }
      checkoutError.value = 'Could not get billing portal URL.'
    } catch (e) {
      checkoutError.value = e instanceof Error ? e.message : 'Could not open billing portal'
    } finally {
      actionLoading.value = false
    }
  }

  watch(
    () => [authUserId.value, currentUserId.value, accessToken.value] as const,
    () => {
      const token = accessToken.value
      const userId = resolveUserId()

      if (!token || !userId) {
        subscription.value = { ...defaultSubscription }
        payments.value = []
        return
      }

      if (import.meta.server) return

      void loadBillingData()
    },
    { immediate: true }
  )

  return {
    subscription,
    payments,
    subscriptionLoading,
    transactionsLoading,
    actionLoading,
    actionLabel,
    billingCycleChoice,
    checkoutError,
    getPriceIdForChoice,
    startProCheckout,
    openBillingPortal,
    refreshSubscription,
    resolveUserId
  }
}
