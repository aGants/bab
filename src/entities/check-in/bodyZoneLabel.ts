import type { BodyZone } from './types'

const ZONE_LABEL_OVERRIDES: Partial<Record<BodyZone, string>> = {
  whole: 'all over',
  head: 'your head',
  neck: 'your neck',
  pelvic: 'your pelvic area',
}

/** Human-readable phrase for a body zone, e.g. "your left shoulder" —
 * used wherever a picked zone needs to read as a sentence, not an id. */
export const bodyZoneLabel = (zone: BodyZone): string => {
  const override = ZONE_LABEL_OVERRIDES[zone]
  if (override) return override

  const match = zone.match(/^(.+?)(Left|Right)$/)
  if (!match) return `your ${zone}`

  const [, base, side] = match
  const words = base.replace(/([A-Z])/g, ' $1').toLowerCase()
  return `your ${side.toLowerCase()} ${words}`
}
