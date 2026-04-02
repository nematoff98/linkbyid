export const analyticsService = {
  async trackSearch(userId: string, query: string, sourceUrl: string) {
    const api = useApi()
    return await api('/analytics/search', {
      method: 'POST',
      body: { userId, query, sourceUrl }
    })
  },
  async trackClick(username: string, linkCode: string, referrer: string) {
    const api = useApi()
    return await api('/analytics/click', {
      method: 'POST',
      body: { username, linkCode, referrer }
    })
  }
}
