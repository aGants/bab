import type { DailyLog } from './types'
import { createStoredJson } from '@/shared/lib/storedJson'

/**
 * One record per calendar day, independent of how many check-ins happen that
 * day — period/painkiller are day-level facts, not attributes of a single
 * check-in. Written as if it already talks to a real API, same as
 * CheckInRepository.
 */
export interface DailyLogRepository {
  get(date: string): Promise<DailyLog | null>
  getRange(fromDate: string, toDate: string): Promise<DailyLog[]>
  setHadPeriod(date: string, hadPeriod: boolean): Promise<DailyLog>
  setTookPainkiller(date: string, tookPainkiller: boolean): Promise<DailyLog>
}

const STORAGE_KEY = 'daily-logs'

const emptyLog = (date: string): DailyLog => ({ date, hadPeriod: null, tookPainkiller: null })

export const createLocalStorageDailyLogRepository = (): DailyLogRepository => {
  // what is stored is parsed once, not on every call; see createStoredJson
  const stored = createStoredJson<Readonly<Record<string, DailyLog>>>(STORAGE_KEY, (json) =>
    json && typeof json === 'object' ? (json as Record<string, DailyLog>) : {},
  )

  const upsert = (date: string, patch: Partial<Omit<DailyLog, 'date'>>): DailyLog => {
    const logs = stored.read()
    const next: DailyLog = { ...(logs[date] ?? emptyLog(date)), ...patch }
    stored.write({ ...logs, [date]: next })
    return next
  }

  return {
    get: async (date) => stored.read()[date] ?? null,

    getRange: async (fromDate, toDate) =>
      Object.values(stored.read()).filter((log) => log.date >= fromDate && log.date <= toDate),

    setHadPeriod: async (date, hadPeriod) => upsert(date, { hadPeriod }),

    setTookPainkiller: async (date, tookPainkiller) => upsert(date, { tookPainkiller }),
  }
}

/** App-wide instance — import this in features, not the factory, unless you're testing. */
export const dailyLogRepository: DailyLogRepository = createLocalStorageDailyLogRepository()
