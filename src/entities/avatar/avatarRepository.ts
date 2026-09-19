import { parseAvatar } from './avatarModel'
import type { AvatarConfig } from './types'
import { safeStorage } from '@/shared/lib/safeStorage'

/** Written as if it already talks to a real API, same as CheckInRepository. */
export interface AvatarRepository {
  /** null until the user has customised their character at least once. */
  get(): Promise<AvatarConfig | null>
  save(avatar: AvatarConfig): Promise<AvatarConfig>
}

const STORAGE_KEY = 'avatar'

const read = (): AvatarConfig | null => {
  const raw = safeStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return parseAvatar(JSON.parse(raw))
  } catch {
    return null
  }
}

export const createLocalStorageAvatarRepository = (): AvatarRepository => ({
  get: async () => read(),

  save: async (avatar) => {
    safeStorage.setItem(STORAGE_KEY, JSON.stringify(avatar))
    return avatar
  },
})

/** App-wide instance — import this in features, not the factory, unless you're testing. */
export const avatarRepository: AvatarRepository = createLocalStorageAvatarRepository()
