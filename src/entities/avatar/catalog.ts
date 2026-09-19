import type { AccessoryId, AccessorySlot, BodyColorId, BodyId, FaceId } from './types'

export const BODIES: Record<BodyId, { label: string }> = {
  arch: { label: 'Arch' },
  bean: { label: 'Bean' },
  pear: { label: 'Pear' },
  round: { label: 'Round' },
}

/** Same hues as the word shapes, so a body never looks foreign next to a head. */
export const BODY_COLORS: Record<BodyColorId, { label: string; hex: string }> = {
  coral: { label: 'Coral', hex: '#F87C64' },
  teal: { label: 'Teal', hex: '#005050' },
  lime: { label: 'Lime', hex: '#B7EA15' },
  pink: { label: 'Pink', hex: '#FEA7A9' },
  lavender: { label: 'Lavender', hex: '#EEE6FF' },
  red: { label: 'Red', hex: '#FE2A3B' },
}

export const FACES: Record<FaceId, { label: string }> = {
  happy: { label: 'Happy' },
  calm: { label: 'Calm' },
  sleepy: { label: 'Sleepy' },
  surprised: { label: 'Surprised' },
  wink: { label: 'Wink' },
  sad: { label: 'Sad' },
}

export const ACCESSORIES: Record<AccessoryId, { label: string; slot: AccessorySlot }> = {
  crown: { label: 'Crown', slot: 'hat' },
  bow: { label: 'Bow', slot: 'hat' },
  flower: { label: 'Flower', slot: 'hat' },
  glasses: { label: 'Glasses', slot: 'eyes' },
  blush: { label: 'Blush', slot: 'cheeks' },
  scarf: { label: 'Scarf', slot: 'neck' },
  hands: { label: 'Hands', slot: 'hands' },
  sparkles: { label: 'Sparkles', slot: 'aura' },
}
