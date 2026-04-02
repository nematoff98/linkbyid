export default defineNuxtRouteMiddleware((to) => {
  const { accessToken } = useAuthSession()
  const hasToken = Boolean(accessToken.value)
  const isDashboardRoute = to.path.startsWith('/dashboard')
  const isAuthRoute = to.path.startsWith('/auth')

  if (isDashboardRoute && !hasToken) return navigateTo('/auth')
  if (isAuthRoute && hasToken) return navigateTo('/dashboard')
})
