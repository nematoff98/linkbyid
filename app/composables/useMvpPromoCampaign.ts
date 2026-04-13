import { computed } from 'vue'
import {
  computeMvpPromoTrialActive,
  getMvpPromoWindowEnd,
  type MvpPromoPublicConfig,
} from '~/utils/mvpPromoCampaign'

export function useMvpPromoCampaign() {
  const config = useRuntimeConfig()

  const publicCfg = computed(
    (): MvpPromoPublicConfig => ({
      mvpPromoTrial: Boolean(config.public.mvpPromoTrial),
      mvpPromoCampaignStartAt: String(config.public.mvpPromoCampaignStartAt || ''),
      mvpPromoNewUserWindowDays: Number(config.public.mvpPromoNewUserWindowDays),
    }),
  )

  const mvpPromoTrialFlag = computed(() => publicCfg.value.mvpPromoTrial ?? false)

  /** Same condition as dashboard `mvpPromoTrialEnabled` — free MVP activation path open. */
  const isPromoWindowOpen = computed(() => computeMvpPromoTrialActive(publicCfg.value))

  const promoWindowEndsAt = computed(() => getMvpPromoWindowEnd(publicCfg.value))

  const promoWindowEndsLabel = computed(() => {
    const d = promoWindowEndsAt.value
    if (!d) return ''
    try {
      return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(d)
    } catch {
      return d.toISOString().slice(0, 10)
    }
  })

  return {
    mvpPromoTrialFlag,
    isPromoWindowOpen,
    promoWindowEndsAt,
    promoWindowEndsLabel,
  }
}
