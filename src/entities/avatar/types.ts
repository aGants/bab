export const BODY_IDS = ['arch', 'bean', 'pear', 'round'] as const
export type BodyId = (typeof BODY_IDS)[number]

export const BODY_COLOR_IDS = ['coral', 'teal', 'lime', 'pink', 'lavender', 'red'] as const
export type BodyColorId = (typeof BODY_COLOR_IDS)[number]

export const FACE_IDS = ['happy', 'calm', 'sleepy', 'surprised', 'wink', 'sad'] as const
export type FaceId = (typeof FACE_IDS)[number]

export const ACCESSORY_IDS = ['crown', 'bow', 'flower', 'glasses', 'blush', 'scarf', 'hands', 'sparkles'] as const
export type AccessoryId = (typeof ACCESSORY_IDS)[number]

/** Accessories sharing a slot are mutually exclusive — two hats can't sit on one head. */
export type AccessorySlot = 'hat' | 'eyes' | 'cheeks' | 'neck' | 'hands' | 'aura'

export interface AvatarConfig {
  /** references WordDefinition.id from entities/word — the feeling that shapes the head */
  headWordId: string
  bodyId: BodyId
  bodyColor: BodyColorId
  faceId: FaceId
  /** at most one per slot, in the order they were added */
  accessoryIds: AccessoryId[]
}
