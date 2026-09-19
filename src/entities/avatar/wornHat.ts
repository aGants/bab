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

/** Picking the hat already worn takes it off. Saved on every change, and every
 * place showing the character (the World page, the header mascot) updates at once. */
const toggleHat = (id: HatId) => {
  safeStorage.setItem(STORAGE_KEY, read() === id ? '' : id)
  listeners.forEach((listener) => listener())
}

/** The hat on the user's character, or null. */
export const useWornHat = () => {
  const hatId = useSyncExternalStore(subscribe, read, () => null)
  return { hatId, toggleHat }
}
