import { ACCESSORIES } from './catalog'
import {
  ACCESSORY_IDS,
  BODY_COLOR_IDS,
  BODY_IDS,
  FACE_IDS,
  type AccessoryId,
  type AvatarConfig,
} from './types'

/** Used until the user has a check-in to take a feeling from. */
export const FALLBACK_HEAD_WORD_ID = 'light'

export const defaultAvatar = (headWordId: string): AvatarConfig => ({
  headWordId,
  bodyId: 'arch',
  bodyColor: 'coral',
  faceId: 'happy',
  accessoryIds: [],
})

/** Adds the accessory, or takes it off if it's already worn. Putting one on
 * pushes off whatever else was in its slot. */
export const toggleAccessory = (avatar: AvatarConfig, id: AccessoryId): AvatarConfig => {
  if (avatar.accessoryIds.includes(id)) {
    return { ...avatar, accessoryIds: avatar.accessoryIds.filter((existing) => existing !== id) }
  }
  const slot = ACCESSORIES[id].slot
  const kept = avatar.accessoryIds.filter((existing) => ACCESSORIES[existing].slot !== slot)
  return { ...avatar, accessoryIds: [...kept, id] }
}

const isOneOf = <T extends string>(options: readonly T[], value: unknown): value is T =>
  typeof value === 'string' && (options as readonly string[]).includes(value)

/** Validates whatever came out of storage. Anything unrecognised (an option
 * removed in a later version, hand-edited data) falls back to its default
 * instead of crashing the renderer; null means there's nothing usable at all. */
export const parseAvatar = (raw: unknown): AvatarConfig | null => {
  if (!raw || typeof raw !== 'object') return null
  const data = raw as Record<string, unknown>
  if (typeof data.headWordId !== 'string' || data.headWordId === '') return null

  const base = defaultAvatar(data.headWordId)
  let avatar: AvatarConfig = {
    ...base,
    bodyId: isOneOf(BODY_IDS, data.bodyId) ? data.bodyId : base.bodyId,
    bodyColor: isOneOf(BODY_COLOR_IDS, data.bodyColor) ? data.bodyColor : base.bodyColor,
    faceId: isOneOf(FACE_IDS, data.faceId) ? data.faceId : base.faceId,
  }
  const stored = Array.isArray(data.accessoryIds) ? data.accessoryIds : []
  for (const id of stored) {
    if (isOneOf(ACCESSORY_IDS, id) && !avatar.accessoryIds.includes(id)) {
      avatar = toggleAccessory(avatar, id)
    }
  }
  return avatar
}
