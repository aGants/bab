import type { DailyLog } from './types'

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

const readAll = (): Record<string, DailyLog> => {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const writeAll = (logs: Record<string, DailyLog>): void => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
}

const upsert = (date: string, patch: Partial<Omit<DailyLog, 'date'>>): DailyLog => {
  const logs = readAll()
  const next: DailyLog = { ...(logs[date] ?? emptyLog(date)), ...patch }
  logs[date] = next
  writeAll(logs)
  return next
}

export const createLocalStorageDailyLogRepository = (): DailyLogRepository => ({
  get: async (date) => readAll()[date] ?? null,

  getRange: async (fromDate, toDate) =>
    Object.values(readAll()).filter((log) => log.date >= fromDate && log.date <= toDate),

  setHadPeriod: async (date, hadPeriod) => upsert(date, { hadPeriod }),

  setTookPainkiller: async (date, tookPainkiller) => upsert(date, { tookPainkiller }),
})

/** App-wide instance — import this in features, not the factory, unless you're testing. */
export const dailyLogRepository: DailyLogRepository = createLocalStorageDailyLogRepository()
