import type { CheckInEntry, NewCheckInEntry } from './types'
import { toDateKey } from './dateKey'

/**
 * Written as if it already talks to a real API — every method is async even
 * though this implementation is sync localStorage underneath. Swapping in a
 * backend later means writing a new CheckInRepository, not touching callers.
 */
export interface CheckInRepository {
  save(input: NewCheckInEntry): Promise<CheckInEntry>
  getAll(): Promise<CheckInEntry[]>
  getByDate(date: string): Promise<CheckInEntry[]>
  getRange(fromDate: string, toDate: string): Promise<CheckInEntry[]>
  remove(id: string): Promise<void>
}

const STORAGE_KEY = 'check-ins'

const readAll = (): CheckInEntry[] => {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writeAll = (entries: CheckInEntry[]): void => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export const createLocalStorageCheckInRepository = (): CheckInRepository => ({
  save: async (input) => {
    const now = new Date()
    const entry: CheckInEntry = {
      ...input,
      id: crypto.randomUUID(),
      date: toDateKey(now),
      createdAt: now.toISOString(),
    }
    writeAll([...readAll(), entry])
    return entry
  },

  getAll: async () => readAll(),

  getByDate: async (date) => readAll().filter((entry) => entry.date === date),

  getRange: async (fromDate, toDate) =>
    readAll().filter((entry) => entry.date >= fromDate && entry.date <= toDate),

  remove: async (id) => {
    writeAll(readAll().filter((entry) => entry.id !== id))
  },
})

/** App-wide instance — import this in features, not the factory, unless you're testing. */
export const checkInRepository: CheckInRepository = createLocalStorageCheckInRepository()
