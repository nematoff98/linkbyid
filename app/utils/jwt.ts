/**
 * Read JWT payload on the client — for `sub` / user id only.
 * No secret required; token is already in the client cookie.
 */
function parsePayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
    const json = JSON.parse(atob(padded))
    return typeof json === 'object' && json !== null ? (json as Record<string, unknown>) : null
  } catch {
    return null
  }
}

export function getUserIdFromAccessToken(token: string | undefined): string | null {
  if (!token) return null
  const payload = parsePayload(token)
  if (!payload) return null
  const sub = payload.sub
  const uid = payload.userId ?? payload.user_id
  if (typeof sub === 'string' && sub.length > 0) return sub
  if (typeof uid === 'string' && uid.length > 0) return uid
  return null
}
