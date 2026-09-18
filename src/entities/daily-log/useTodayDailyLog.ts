import { useEffect, useState } from 'react'
import { todayKey } from '@/shared/lib/dateKey'
import { dailyLogRepository } from './dailyLogRepository'
import type { DailyLog } from './types'

/** Loads today's period/painkiller marks and persists each toggle immediately
 * — these are day-level facts, so they should survive even if the surrounding
 * check-in flow is later cancelled without saving. */
export const useTodayDailyLog = () => {
  const [log, setLog] = useState<DailyLog | null>(null)

  useEffect(() => {
    dailyLogRepository.get(todayKey()).then(setLog)
  }, [])

  const setHadPeriod = async (hadPeriod: boolean) => {
    setLog(await dailyLogRepository.setHadPeriod(todayKey(), hadPeriod))
  }

  const setTookPainkiller = async (tookPainkiller: boolean) => {
    setLog(await dailyLogRepository.setTookPainkiller(todayKey(), tookPainkiller))
  }

  return {
    /** null = not yet answered for today, distinct from an explicit "no" */
    hadPeriod: log?.hadPeriod ?? null,
    tookPainkiller: log?.tookPainkiller ?? null,
    setHadPeriod,
    setTookPainkiller,
  }
}
