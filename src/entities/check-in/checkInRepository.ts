import type { BodyZone, CheckInEntry, NewCheckInEntry } from './types'
import { toDateKey } from '@/shared/lib/dateKey'

/**
 * Written as if it already talks to a real API — every method is async even
 * though this implementation is sync localStorage underneath. Swapping in a
 * backend later means writing a new CheckInRepository, not touching callers.
 */
export interface CheckInRepository {
  /** `date` defaults to today — pass it to log a check-in against a past day. */
  save(input: NewCheckInEntry, date?: string): Promise<CheckInEntry>
  /** Patches an existing entry's answers, keeping its id/date/createdAt. Null if it no longer exists. */
  update(id: string, patch: NewCheckInEntry): Promise<CheckInEntry | null>
  getAll(): Promise<CheckInEntry[]>
  getById(id: string): Promise<CheckInEntry | null>
  getByDate(date: string): Promise<CheckInEntry[]>
  getRange(fromDate: string, toDate: string): Promise<CheckInEntry[]>
  remove(id: string): Promise<void>
}

const STORAGE_KEY = 'check-ins'

/** Pre-multi-zone entries stored a single `bodyZone` instead of `bodyZones` —
 * normalize them on read so old localStorage data doesn't crash new UI. */
type StoredCheckInEntry = (CheckInEntry | (Omit<CheckInEntry, 'bodyZones'> & { bodyZone: BodyZone })) &
  Partial<Pick<CheckInEntry, 'bodyZones'>>

const normalizeEntry = (entry: StoredCheckInEntry): CheckInEntry => {
  if (entry.bodyZones) return entry as CheckInEntry
  const { bodyZone, ...rest } = entry as Omit<CheckInEntry, 'bodyZones'> & { bodyZone: BodyZone }
  return { ...rest, bodyZones: [bodyZone] }
}

const readAll = (): CheckInEntry[] => {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(normalizeEntry) : []
  } catch {
    return []
  }
}

const writeAll = (entries: CheckInEntry[]): void => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export const createLocalStorageCheckInRepository = (): CheckInRepository => ({
  save: async (input, date) => {
    const now = new Date()
    const entry: CheckInEntry = {
      ...input,
      id: crypto.randomUUID(),
      date: date ?? toDateKey(now),
      createdAt: now.toISOString(),
    }
    writeAll([...readAll(), entry])
    return entry
  },

  update: async (id, patch) => {
    const entries = readAll()
    const index = entries.findIndex((entry) => entry.id === id)
    if (index === -1) return null
    const updated: CheckInEntry = { ...entries[index], ...patch }
    entries[index] = updated
    writeAll(entries)
    return updated
  },

  getAll: async () => readAll(),

  getById: async (id) => readAll().find((entry) => entry.id === id) ?? null,

  getByDate: async (date) => readAll().filter((entry) => entry.date === date),

  getRange: async (fromDate, toDate) =>
    readAll().filter((entry) => entry.date >= fromDate && entry.date <= toDate),

  remove: async (id) => {
    writeAll(readAll().filter((entry) => entry.id !== id))
  },
})

/** App-wide instance — import this in features, not the factory, unless you're testing. */
export const checkInRepository: CheckInRepository = createLocalStorageCheckInRepository()
