import type { MessageDescriptor } from '@lingui/core'
import { msg } from '@lingui/core/macro'
import type { AccessoryId, BodyColorId, BodyId, FaceId } from '@/entities/avatar/types'

// Picker labels for the avatar's options. The options themselves (ids, colours,
// slots) live in entities/avatar; the wording lives here so it can be translated.

export const BODY_LABELS: Record<BodyId, MessageDescriptor> = {
  arch: msg`Arch`,
  bean: msg`Bean`,
  pear: msg`Pear`,
  round: msg`Round`,
}

export const BODY_COLOR_LABELS: Record<BodyColorId, MessageDescriptor> = {
  coral: msg`Coral`,
  teal: msg`Teal`,
  lime: msg`Lime`,
  pink: msg`Pink`,
  lavender: msg`Lavender`,
  red: msg`Red`,
}

export const FACE_LABELS: Record<FaceId, MessageDescriptor> = {
  happy: msg`Happy`,
  calm: msg`Calm`,
  sleepy: msg`Sleepy`,
  surprised: msg`Surprised`,
  wink: msg`Wink`,
  sad: msg`Sad`,
}

export const ACCESSORY_LABELS: Record<AccessoryId, MessageDescriptor> = {
  crown: msg`Crown`,
  bow: msg`Bow`,
  flower: msg`Flower`,
  glasses: msg`Glasses`,
  blush: msg`Blush`,
  scarf: msg`Scarf`,
  hands: msg`Hands`,
  sparkles: msg`Sparkles`,
}
