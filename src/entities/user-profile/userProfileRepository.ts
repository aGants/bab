import type { UserProfile } from './types'
import { safeStorage } from '@/shared/lib/safeStorage'

/** Written as if it already talks to a real API, same as CheckInRepository.
 * An empty name means "not set"; screens show a translated fallback in its place. */
export interface UserProfileRepository {
  get(): Promise<UserProfile>
  setName(name: string): Promise<UserProfile>
}

const STORAGE_KEY = 'user-profile'

const read = (): UserProfile => {
  const raw = safeStorage.getItem(STORAGE_KEY)
  if (!raw) return { name: '' }
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed.name === 'string' ? parsed : { name: '' }
  } catch {
    return { name: '' }
  }
}

const write = (profile: UserProfile): void => {
  safeStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export const createLocalStorageUserProfileRepository = (): UserProfileRepository => ({
  get: async () => read(),

  setName: async (name) => {
    const next = { name }
    write(next)
    return next
  },
})

/** App-wide instance — import this in features, not the factory, unless you're testing. */
export const userProfileRepository: UserProfileRepository = createLocalStorageUserProfileRepository()
