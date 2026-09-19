import { useState } from 'react'
import { safeStorage } from '@/shared/lib/safeStorage'
import { isHatId, type HatId } from './hatCatalog'

const STORAGE_KEY = 'world-hat'

const read = (): HatId | null => {
  const stored = safeStorage.getItem(STORAGE_KEY)
  return isHatId(stored) ? stored : null
}

/** The hat on the World character. Picking the hat already worn takes it off.
 * Saved on every change so it's still on after leaving the page. */
export const useWornHat = () => {
  const [hatId, setHatId] = useState<HatId | null>(read)

  const toggleHat = (id: HatId) => {
    const next = hatId === id ? null : id
    setHatId(next)
    safeStorage.setItem(STORAGE_KEY, next ?? '')
  }

  return { hatId, toggleHat }
}
