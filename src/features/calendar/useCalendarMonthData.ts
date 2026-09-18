import { useEffect, useState } from 'react'
import { checkInRepository } from '@/entities/check-in/checkInRepository'
import { dailyLogRepository } from '@/entities/daily-log/dailyLogRepository'
import { toDateKey } from '@/shared/lib/dateKey'
import type { CheckInEntry } from '@/entities/check-in/types'
import type { DailyLog } from '@/entities/daily-log/types'

const monthRange = (month: Date): { fromDate: string; toDate: string } => {
  const from = new Date(month.getFullYear(), month.getMonth(), 1)
  const to = new Date(month.getFullYear(), month.getMonth() + 1, 0)
  return { fromDate: toDateKey(from), toDate: toDateKey(to) }
}

const groupByDate = (entries: CheckInEntry[]): Record<string, CheckInEntry[]> => {
  const grouped: Record<string, CheckInEntry[]> = {}
  for (const entry of entries) {
    ;(grouped[entry.date] ??= []).push(entry)
  }
  return grouped
}

/** Loads check-ins and daily logs for one visible month, keyed by day —
 * refetches whenever the calendar page flips month. */
export const useCalendarMonthData = (month: Date) => {
  const [entriesByDate, setEntriesByDate] = useState<Record<string, CheckInEntry[]>>({})
  const [dailyLogsByDate, setDailyLogsByDate] = useState<Record<string, DailyLog>>({})

  useEffect(() => {
    const { fromDate, toDate } = monthRange(month)
    let cancelled = false

    Promise.all([
      checkInRepository.getRange(fromDate, toDate),
      dailyLogRepository.getRange(fromDate, toDate),
    ]).then(([entries, logs]) => {
      if (cancelled) return
      setEntriesByDate(groupByDate(entries))
      setDailyLogsByDate(Object.fromEntries(logs.map((log) => [log.date, log])))
    })

    return () => {
      cancelled = true
    }
  }, [month])

  return { entriesByDate, dailyLogsByDate }
}
