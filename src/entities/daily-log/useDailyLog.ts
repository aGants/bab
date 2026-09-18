import { useEffect, useState } from 'react'
import { dailyLogRepository } from './dailyLogRepository'
import type { DailyLog } from './types'

/** Loads a day's period/painkiller marks and persists each toggle immediately
 * — these are day-level facts, so they should survive even if the surrounding
 * check-in flow is later cancelled without saving. */
export const useDailyLog = (date: string) => {
  const [log, setLog] = useState<DailyLog | null>(null)

  useEffect(() => {
    dailyLogRepository.get(date).then(setLog)
  }, [date])

  const setHadPeriod = async (hadPeriod: boolean) => {
    setLog(await dailyLogRepository.setHadPeriod(date, hadPeriod))
  }

  const setTookPainkiller = async (tookPainkiller: boolean) => {
    setLog(await dailyLogRepository.setTookPainkiller(date, tookPainkiller))
  }

  return {
    /** null = not yet answered for this day, distinct from an explicit "no" */
    hadPeriod: log?.hadPeriod ?? null,
    tookPainkiller: log?.tookPainkiller ?? null,
    setHadPeriod,
    setTookPainkiller,
  }
}
