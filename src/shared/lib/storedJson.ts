import { safeStorage } from './safeStorage'

const deepFreeze = <T>(value: T): T => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(deepFreeze)
    Object.freeze(value)
  }
  return value
}

/** A JSON value kept in local storage under one key. Reading it back means parsing the whole text, so that
 * is done once and the result reused for as long as the stored text stays the same; it is read again after
 * its own write and after anything else (another tab, a reset) changes what is stored.
 *
 * `fromJson` turns what was parsed into the value wanted; it gets `null` when nothing is stored or the text
 * isn't valid JSON. The result is shared between callers, so it comes back frozen: to change something,
 * build a new value from it and `write` that. */
export const createStoredJson = <T>(key: string, fromJson: (json: unknown) => T) => {
  let readFrom: string | null = null
  let cached: { value: T } | null = null

  return {
    read: (): T => {
      const raw = safeStorage.getItem(key)
      if (cached && raw === readFrom) return cached.value
      let json: unknown = null
      if (raw) {
        try {
          json = JSON.parse(raw)
        } catch {
          // damaged text is treated as nothing stored
        }
      }
      readFrom = raw
      cached = { value: deepFreeze(fromJson(json)) }
      return cached.value
    },

    write: (value: T): void => {
      safeStorage.setItem(key, JSON.stringify(value))
      cached = null
    },
  }
}
