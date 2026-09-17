import type { Slug } from 'react-muscle-highlighter'
import type { BodyZone } from '@/entities/check-in/types'

export type Side = 'left' | 'right'
export type SidedBase = 'shoulder' | 'arm' | 'hand' | 'hip' | 'thigh' | 'knee' | 'calf' | 'ankle' | 'foot'

export const sidedZone = (base: SidedBase, side: Side): BodyZone =>
  `${base}${side === 'left' ? 'Left' : 'Right'}` as BodyZone

// Which app zone a click on a given slug/side resolves to, per view. Several
// slugs can point at the same zone (e.g. abs + obliques -> abdomen) — that's fine.
export const FRONT_FORWARD: Partial<Record<Slug, BodyZone | SidedBase>> = {
  head: 'head',
  hair: 'head',
  neck: 'neck',
  deltoids: 'shoulder',
  chest: 'chest',
  abs: 'abdomen',
  obliques: 'abdomen',
  biceps: 'arm',
  forearm: 'arm',
  hands: 'hand',
  adductors: 'thigh',
  quadriceps: 'thigh',
  knees: 'knee',
  tibialis: 'calf',
  calves: 'calf',
  ankles: 'ankle',
  feet: 'foot',
  trapezius: 'shoulder',
  triceps: 'arm',
}

// The back asset doesn't render separate head/knee/ankle paths at all (only
// 14 slugs exist in that view), so those don't get entries here — front view
// already covers those zones.
export const BACK_FORWARD: Partial<Record<Slug, BodyZone | SidedBase>> = {
  hair: 'head',
  neck: 'neck',
  trapezius: 'shoulder',
  deltoids: 'shoulder',
  triceps: 'arm',
  forearm: 'arm',
  hands: 'hand',
  'upper-back': 'upperBack',
  'lower-back': 'lowerBack',
  gluteal: 'hip',
  hamstring: 'thigh',
  adductors: 'thigh',
  calves: 'calf',
  feet: 'foot',
}

// Calm/pastel scheme: lavender body silhouette, selected zone softened
// toward a muted peach rather than the punchy brand coral.
export const BODY_FILL = 'var(--color-cycle)'
export const BODY_STROKE = 'color-mix(in srgb, var(--color-ink) 20%, transparent)'
export const SELECTED_FILL = 'color-mix(in srgb, var(--color-signals) 55%, var(--color-ground))'

export const SCALE = 1.4
// The library draws no muscle there (it's a fitness-anatomy asset, not a full
// body map), so these two spots have no clickable path at all — manual
// hit-targets over the gaps, positioned as % of the rendered 200x400
// (pre-scale) body so they stay put across `scale` changes.
// Groin/pelvic gap, maps to the existing `abdomen` zone rather than adding a
// separate anatomical one.
export const PELVIC_HOTSPOT = { left: 40, top: 38, width: 20, height: 18 }
// Wrist gap between forearm and hand, present on both front and back views.
export const WRIST_HOTSPOT_LEFT = { left: 8, top: 41, width: 14, height: 6 }
export const WRIST_HOTSPOT_RIGHT = { left: 78, top: 41, width: 14, height: 6 }

const SIDED_BASES = new Set<string>(['shoulder', 'arm', 'hand', 'hip', 'thigh', 'knee', 'calf', 'ankle', 'foot'])
export const isSidedBase = (v: string): v is SidedBase => SIDED_BASES.has(v)

export const resolveZone = (entry: BodyZone | SidedBase, side?: Side): BodyZone | null => {
  if (isSidedBase(entry)) return side ? sidedZone(entry, side) : null
  return entry
}

// Does this slug (as rendered on `side`, if any) belong to the selected zone?
// Front view maps both `tibialis` and `calves` to `calf`, for example — both
// need to light up, not just one "representative" muscle, or clicking
// whichever one isn't picked looks like nothing happened.
export const matchesZone = (entry: BodyZone | SidedBase, side: Side | undefined, value: BodyZone): boolean =>
  isSidedBase(entry) ? side !== undefined && sidedZone(entry, side) === value : entry === value
