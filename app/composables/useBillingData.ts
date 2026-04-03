import type { BillingPayment, BillingSubscription, BillingTransactionApi } from '~/types/billing'
import { billingFetchTransactions, billingService } from '~/services/billing.service'
import { getApiErrorMessage } from '~/utils/apiError'
import { useAuthSession } from '~/composables/useAuthSession'
import { useDashboardData } from '~/composables/useDashboardData'
import { getUserIdFromAccessToken } from '~/utils/jwt'
import { defaultBillingSubscriptionState, mapBillingSubscriptionApiToBilling } from '~/utils/subscriptionFromMe'

export type BillingCycleChoice = 'monthly' | 'yearly'

const defaultHistory: BillingPayment[] = []

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

/** Deduplicate concurrent loadBillingData (multiple components used to register duplicate watches). */
let loadBillingDataInFlight: Promise<void> | null = null

export const useBillingData = () => {
  const api = useApi()

  const { subscription, loadMyProfile, currentUserId } = useDashboardData()
  const payments = useState<BillingPayment[]>('billing-payments', () => [...defaultHistory])
  const actionLoading = ref(false)
  const checkoutError = ref('')

  const billingCycleChoice = useState<BillingCycleChoice>('billing-cycle-choice', () => 'monthly')

  /** Billing page fills this from GET /billing/subscription/:id; fallback to /profiles/me for label. */
  const billingPageSubscription = useState<BillingSubscription | null>('billing-page-subscription', () => null)

  const actionLabel = computed(() => {
    const plan = billingPageSubscription.value?.plan ?? subscription.value.plan
    return plan === 'free' ? 'Upgrade to Pro (Stripe)' : 'Manage subscription'
  })

  const subscriptionLoading = ref(false)
  const transactionsLoading = ref(false)
  const { userId: authUserId, accessToken } = useAuthSession()

  const config = useRuntimeConfig()

  const mvpPromoTrialEnabled = computed(() => Boolean(config.public.mvpPromoTrial))

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

  /** GET /billing/subscription/:userId — use on Billing page (not for global sidebar plan). */
  const fetchBillingPageSubscription = async () => {
    if (import.meta.server) return
    const userId = resolveUserId()
    const monthly = String(config.public.billingProMonthlyLabel || '$1.99/mo')
    const yearly = String(config.public.billingProYearlyLabel || '$15.99/yr')
    if (!userId || !accessToken.value) {
      billingPageSubscription.value = null
      return
    }
    try {
      const res = await billingService.getSubscription(userId)
      const data = res?.data
      if (data) {
        billingPageSubscription.value = mapBillingSubscriptionApiToBilling(data, monthly, yearly)
      } else {
        billingPageSubscription.value = { ...defaultBillingSubscriptionState }
      }
    } catch (e) {
      console.error('Failed to load billing subscription:', e)
      billingPageSubscription.value = { ...subscription.value }
    }
  }

  const fetchTransactions = async () => {
    transactionsLoading.value = true
    try {
      const rows = await billingFetchTransactions(api)
      payments.value = mapTransactions(rows)
    } catch (e) {
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
      subscription.value = { ...defaultBillingSubscriptionState }
      billingPageSubscription.value = null
      payments.value = []
      return
    }
    if (loadBillingDataInFlight) return loadBillingDataInFlight

    loadBillingDataInFlight = (async () => {
      subscriptionLoading.value = true
      try {
        await loadMyProfile(true)
      } finally {
        subscriptionLoading.value = false
        loadBillingDataInFlight = null
      }
    })()

    return loadBillingDataInFlight
  }

  const refreshSubscription = async () => {
    if (import.meta.server) return
    if (!resolveUserId() || !accessToken.value) return
    subscriptionLoading.value = true
    try {
      await loadMyProfile(true)
    } finally {
      subscriptionLoading.value = false
    }
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

    if (mvpPromoTrialEnabled.value) {
      if (billingCycleChoice.value === 'yearly') {
        checkoutError.value = 'Yearly billing is coming soon.'
        return
      }
      actionLoading.value = true
      try {
        await billingService.activateMvpPromo()
        await refreshSubscription()
        await fetchBillingPageSubscription()
        await fetchTransactions()
      } catch (e) {
        checkoutError.value = getApiErrorMessage(e, 'Could not activate trial.')
      } finally {
        actionLoading.value = false
      }
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

  /** One watch total — `useBillingData()` is called from Sidebar, Topbar, Billing, etc. */
  const billingAuthWatchStarted = useState('billing-auth-watch-started', () => false)
  if (import.meta.client && !billingAuthWatchStarted.value) {
    billingAuthWatchStarted.value = true
    watch(
      () => [authUserId.value, currentUserId.value, accessToken.value] as const,
      () => {
        const token = accessToken.value
        const userId = resolveUserId()

        if (!token || !userId) {
          subscription.value = { ...defaultBillingSubscriptionState }
          billingPageSubscription.value = null
          payments.value = []
          return
        }

        void loadBillingData()
      },
      { immediate: true }
    )
  }

  return {
    subscription,
    billingPageSubscription,
    payments,
    subscriptionLoading,
    transactionsLoading,
    actionLoading,
    actionLabel,
    billingCycleChoice,
    checkoutError,
    getPriceIdForChoice,
    mvpPromoTrialEnabled,
    startProCheckout,
    openBillingPortal,
    refreshSubscription,
    resolveUserId,
    /** GET /billing/transactions — call from Billing page (not on every app reload). */
    loadTransactions: fetchTransactions,
    fetchBillingPageSubscription
  }
}
