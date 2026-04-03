/**
 * Statistics and tickets are Pro-only. Free users are sent back to Links.
 */
export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return
  const { accessToken } = useAuthSession()
  if (!accessToken.value) return

  const { subscription, refreshSubscription } = useBillingData()
  await refreshSubscription()
  if (subscription.value.plan === 'free') {
    return navigateTo('/dashboard/links')
  }
})
