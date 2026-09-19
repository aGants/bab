import { useSyncExternalStore } from 'react'
import { safeStorage } from '@/shared/lib/safeStorage'

/** One saved choice about the character (its hat, its head) kept in local
 * storage. Every place drawing the character reads it through `useValue`, so
 * saving a new one updates them all at once, in this tab and in others. */
export const createStoredChoice = <T extends string>(key: string, isValid: (value: unknown) => value is T) => {
  const listeners = new Set<() => void>()

  const read = (): T | null => {
    const stored = safeStorage.getItem(key)
    return isValid(stored) ? stored : null
  }

  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    // another tab changing the choice
    const onStorage = (event: StorageEvent) => {
      if (event.key === key || event.key === null) listener()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      listeners.delete(listener)
      window.removeEventListener('storage', onStorage)
    }
  }

  /** Makes `value` (or nothing) the saved choice. */
  const save = (value: T | null) => {
    safeStorage.setItem(key, value ?? '')
    listeners.forEach((listener) => listener())
  }

  const useValue = () => useSyncExternalStore(subscribe, read, () => null)

  return { save, useValue }
}
