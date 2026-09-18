import type { UserProfile } from './types'

export const DEFAULT_NAME = 'Girl'

/** Written as if it already talks to a real API, same as CheckInRepository. */
export interface UserProfileRepository {
  get(): Promise<UserProfile>
  setName(name: string): Promise<UserProfile>
}

const STORAGE_KEY = 'user-profile'

const read = (): UserProfile => {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return { name: DEFAULT_NAME }
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed.name === 'string' ? parsed : { name: DEFAULT_NAME }
  } catch {
    return { name: DEFAULT_NAME }
  }
}

const write = (profile: UserProfile): void => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
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
