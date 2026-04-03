/**
 * True when `/profiles/me` (via loadBillingData → loadMyProfile) has finished for the current session.
 * Used for dashboard shell: full-screen boot overlay, sidebar plan filter, Pro-only topbar controls.
 */
export function useDashboardNavReady() {
  const { accessToken } = useAuthSession()
  const { profileLoading, profileLoaded } = useDashboardData()
  const { subscriptionLoading } = useBillingData()

  const navReady = computed(() => {
    if (!accessToken.value) return true
    return profileLoaded.value && !profileLoading.value && !subscriptionLoading.value
  })

  return { navReady }
}
