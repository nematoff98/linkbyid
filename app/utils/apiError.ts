/**
 * Parses API / ofetch errors for display. Backend messages are passed through when present.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = 'Request failed. Please try again.'
): string {
  if (!error || typeof error !== 'object') return fallback
  const data = (error as { data?: Record<string, unknown> }).data
  const rootMessage = data?.message
  const nestedError = data?.error as Record<string, unknown> | undefined
  const nestedMessage = nestedError?.message
  if (Array.isArray(nestedMessage) && nestedMessage.length > 0) return nestedMessage.join(', ')
  if (typeof nestedMessage === 'string' && nestedMessage.trim()) return nestedMessage
  if (typeof rootMessage === 'string' && rootMessage.trim()) return rootMessage
  if (Array.isArray(rootMessage) && rootMessage.length > 0) return rootMessage.join(', ')
  if (data?.error && typeof data.error === 'string') return data.error
  if (error instanceof Error) return error.message
  return fallback
}
