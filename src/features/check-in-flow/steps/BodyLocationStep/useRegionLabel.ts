import { useLingui } from '@lingui/react/macro'
import type { BodyZone } from '@/entities/check-in/types'
import { bodyZoneShortLabel } from '@/i18n'

/** Screen-reader name for a tappable body region. Same wording as the zone lists,
 * except the head shape, which in this artwork also covers the neck. */
export const useRegionLabel = () => {
  const { t } = useLingui()
  return (zone: BodyZone): string => (zone === 'head' ? t`Head & neck` : bodyZoneShortLabel(zone))
}
