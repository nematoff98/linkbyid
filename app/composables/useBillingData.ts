import type { BillingPayment, BillingSubscription, PlanType } from '~/types/billing'
import { billingService } from '~/services/billing.service'
import { useAuthSession } from '~/composables/useAuthSession'
import { useDashboardData } from '~/composables/useDashboardData'

const defaultSubscription: BillingSubscription = {
  plan: 'free',
  priceLabel: '$0/month',
  expiryDate: null,
  status: 'active'
}

const defaultHistory: BillingPayment[] = []

export const useBillingData = () => {
  const subscription = useState<BillingSubscription>('billing-subscription', () => ({ ...defaultSubscription }))
  const payments = useState<BillingPayment[]>('billing-payments', () => [...defaultHistory])
  const actionLoading = ref(false)

  const actionLabel = computed(() => subscription.value.plan === 'free' ? 'Upgrade to Pro' : 'Manage subscription')

  const subscriptionLoading = ref(false)
  const { userId: authUserId, accessToken } = useAuthSession()
  const { currentUserId, loadMyProfile } = useDashboardData()

  const fetchSubscription = async (userId: string) => {
    subscriptionLoading.value = true
    try {
      const response = await billingService.getSubscription(userId)
      const data = response?.data
      if (!data) return

      subscription.value = {
        plan: data.plan,
        priceLabel: data.plan === 'free' ? '$0/month' : '$5/month',
        expiryDate: data.currentPeriodEnd ? data.currentPeriodEnd.slice(0, 10) : null,
        status: data.status
      }
    } catch (e) {
      // Xatolik bo'lsa, UI default qiymatlardan foydalanadi.
      // eslint-disable-next-line no-console
      console.error('Failed to load billing subscription:', e)
    } finally {
      subscriptionLoading.value = false
    }
  }

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

  const cancelSubscription = () => openBillingPortal()

  watch(
    () => authUserId.value || currentUserId.value,
    async (userId) => {
      // Auth yo'q bo'lsa, default plan ko'rsatamiz.
      if (!userId || !accessToken.value) {
        subscription.value = { ...defaultSubscription }
        payments.value = [...defaultHistory]
        return
      }

      // `loadMyProfile()` orqali `currentUserId` to'ldirilishi mumkin.
      if (!currentUserId.value) {
        await loadMyProfile().catch(() => {})
      }

      await fetchSubscription(userId)
    },
    { immediate: true }
  )

  return { subscription, payments, subscriptionLoading, actionLoading, actionLabel, openStripe, openBillingPortal, cancelSubscription }
}
