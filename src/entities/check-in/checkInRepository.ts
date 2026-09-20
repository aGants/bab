import type { BodyZone, CheckInEntry, NewCheckInEntry, Trigger } from './types'
import { createId } from '@/shared/lib/createId'
import { toDateKey } from '@/shared/lib/dateKey'
import { safeStorage } from '@/shared/lib/safeStorage'

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
  Partial<Pick<CheckInEntry, 'bodyZones'>> & { trigger?: Trigger }

/** Zone ids from earlier versions of the body map, mapped to their current
 * equivalents. Without this, old entries point at zones that no longer exist. */
const LEGACY_ZONES: Record<string, BodyZone[]> = {
  chest: ['chestLeft', 'chestRight'],
  upperBack: ['upperBackLeft', 'upperBackRight'],
  lowerBack: ['lowerBackLeft', 'lowerBackRight'],
  abdomen: ['absLeft', 'absRight'],
  armLeft: ['upperArmLeft'],
  armRight: ['upperArmRight'],
  thighLeft: ['quadLeft'],
  thighRight: ['quadRight'],
}

const migrateZones = (zones: BodyZone[]): BodyZone[] => [
  ...new Set(zones.flatMap((zone) => LEGACY_ZONES[zone] ?? [zone])),
]

/** Entries saved while the trigger question was single-choice hold one `trigger`
 * instead of a `triggers` list. */
const migrateTriggers = <T extends { trigger?: Trigger; triggers?: Trigger[] }>(entry: T): Omit<T, 'trigger'> => {
  const { trigger, ...rest } = entry
  return trigger && !rest.triggers ? { ...rest, triggers: [trigger] } : rest
}

const normalizeEntry = (entry: StoredCheckInEntry): CheckInEntry => {
  if (entry.bodyZones) {
    return migrateTriggers({ ...entry, bodyZones: migrateZones(entry.bodyZones) }) as CheckInEntry
  }
  const { bodyZone, ...rest } = entry as Omit<CheckInEntry, 'bodyZones'> & { bodyZone: BodyZone }
  return migrateTriggers({ ...rest, bodyZones: migrateZones([bodyZone]) }) as CheckInEntry
}

const readAll = (): CheckInEntry[] => {
  const raw = safeStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(normalizeEntry) : []
  } catch {
    return []
  }
}

const writeAll = (entries: CheckInEntry[]): void => {
  safeStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export const createLocalStorageCheckInRepository = (): CheckInRepository => ({
  save: async (input, date) => {
    const now = new Date()
    const entry: CheckInEntry = {
      ...input,
      id: createId(),
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
