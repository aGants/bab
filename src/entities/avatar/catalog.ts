import type { AccessoryId, AccessorySlot, BodyColorId } from './types'

/** Same hues as the word shapes, so a body never looks foreign next to a head. */
export const BODY_COLORS: Record<BodyColorId, { hex: string }> = {
  coral: { hex: '#F87C64' },
  teal: { hex: '#005050' },
  lime: { hex: '#B7EA15' },
  pink: { hex: '#FEA7A9' },
  lavender: { hex: '#EEE6FF' },
  red: { hex: '#FE2A3B' },
}

export const ACCESSORIES: Record<AccessoryId, { slot: AccessorySlot }> = {
  crown: { slot: 'hat' },
  bow: { slot: 'hat' },
  flower: { slot: 'hat' },
  glasses: { slot: 'eyes' },
  blush: { slot: 'cheeks' },
  scarf: { slot: 'neck' },
  hands: { slot: 'hands' },
  sparkles: { slot: 'aura' },
}
