/**
 * Backend sometimes returns relative paths (e.g. `/uuid` or `/uploads/...`).
 * Without a host, the browser resolves them against the Nuxt origin → 404.
 */
export function resolveMediaUrl(raw: string | null | undefined, apiBase: string): string {
  const s = typeof raw === 'string' ? raw.trim() : ''
  if (!s) return ''
  if (/^https?:\/\//i.test(s)) return s
  const base = apiBase.replace(/\/+$/, '')
  if (!base) return s
  return s.startsWith('/') ? `${base}${s}` : `${base}/${s}`
}
