export const useDashboardTheme = () => {
  const theme = useCookie<'light' | 'dark'>('dashboard_theme', {
    default: () => 'light',
    sameSite: 'lax'
  })
  const isDark = computed(() => theme.value === 'dark')

  const toggleTheme = () => {
    theme.value = isDark.value ? 'light' : 'dark'
  }

  return { isDark, toggleTheme }
}
