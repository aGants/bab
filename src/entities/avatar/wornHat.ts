import { useSyncExternalStore } from 'react'
import { safeStorage } from '@/shared/lib/safeStorage'
import { isHatId, type HatId } from './hatCatalog'

const STORAGE_KEY = 'world-hat'

const listeners = new Set<() => void>()

const read = (): HatId | null => {
  const stored = safeStorage.getItem(STORAGE_KEY)
  return isHatId(stored) ? stored : null
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  // another tab changing the hat
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

/** Makes `id` (or no hat) the hat the character wears, and saves it. Every
 * place showing the character (the header mascot, the World page) updates at once. */
const saveHat = (id: HatId | null) => {
  safeStorage.setItem(STORAGE_KEY, id ?? '')
  listeners.forEach((listener) => listener())
}

/** The hat the user has saved on their character, or null. */
export const useWornHat = () => {
  const hatId = useSyncExternalStore(subscribe, read, () => null)
  return { hatId, saveHat }
}
