import type { BodyZone } from '@/entities/check-in/types'

// Calm/pastel scheme: lavender body silhouette, selected zone softened
// toward a muted peach rather than the punchy brand coral.
export const BODY_FILL = 'var(--color-cycle)'
export const SELECTED_FILL = 'color-mix(in srgb, var(--color-signals) 55%, var(--color-ground))'
export const FOCUS_STROKE = 'var(--color-signals)'

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
