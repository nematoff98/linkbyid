/** Public runtime slice used by `computeMvpPromoTrialActive`. */
export type MvpPromoPublicConfig = {
  mvpPromoTrial?: boolean
  mvpPromoCampaignStartAt?: string
  mvpPromoNewUserWindowDays?: number
}

/**
 * MVP free activation (POST /billing/mvp-promo/activate) is allowed only when:
 * - `mvpPromoTrial` flag is true, and
 * - current time is on or before `campaignStart + windowDays` (when start + days are set).
 * If start/days are missing, falls back to flag-only (legacy).
 */
export function computeMvpPromoTrialActive(cfg: MvpPromoPublicConfig): boolean {
  if (!cfg.mvpPromoTrial) return false
  const start = String(cfg.mvpPromoCampaignStartAt || '').trim()
  const raw = cfg.mvpPromoNewUserWindowDays
  const days = typeof raw === 'number' ? raw : Number(raw)
  if (!start || !Number.isFinite(days) || days <= 0) return true
  const t = Date.parse(start)
  if (Number.isNaN(t)) return true
  return Date.now() <= t + days * 86400000
}

/** Inclusive end instant of the new-user window, or null if not computable. */
export function getMvpPromoWindowEnd(cfg: MvpPromoPublicConfig): Date | null {
  const start = String(cfg.mvpPromoCampaignStartAt || '').trim()
  const raw = cfg.mvpPromoNewUserWindowDays
  const days = typeof raw === 'number' ? raw : Number(raw)
  if (!start || !Number.isFinite(days) || days <= 0) return null
  const t = Date.parse(start)
  if (Number.isNaN(t)) return null
  return new Date(t + days * 86400000)
}
