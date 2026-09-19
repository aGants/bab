import { useMemo, useState } from 'react'
import { DayPicker, type DayButtonProps } from 'react-day-picker'
import { addMonths, format } from 'date-fns'
import 'react-day-picker/style.css'
import { Link, useSearchParams } from 'react-router-dom'
import { PageFrame } from '@/shared/layout'
import { Greeting, TabBar } from '@/shared/ui'
import { toDateKey } from '@/shared/lib/dateKey'
import { WordShape } from '@/entities/word'
import { WORD_CARDS, type WordCard } from '@/i18n'
import { wordsPath } from '@/routes/paths'
import { checkInRepository } from '@/entities/check-in/checkInRepository'
import { DayLogDialog } from './DayLogDialog'
import { useCalendarMonthData } from './useCalendarMonthData'
import './CalendarPage.css'

const MonthChevron = ({ direction }: { direction: 'left' | 'right' }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d={direction === 'left' ? 'M12.5 4.5 7 10l5.5 5.5' : 'M7.5 4.5 13 10l-5.5 5.5'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const parseDateKey = (key: string | null): Date | undefined => {
  if (!key) return undefined
  const parsed = new Date(`${key}T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

export const CalendarPage = () => {
  const [searchParams] = useSearchParams()
  const initialDate = useMemo(() => parseDateKey(searchParams.get('date')), [searchParams])

  const [month, setMonth] = useState(initialDate ?? new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate)
  const { entriesByDate, dailyLogsByDate, refetch } = useCalendarMonthData(month)

  const selectedKey = selectedDate ? toDateKey(selectedDate) : null
  const selectedEntries = selectedKey ? (entriesByDate[selectedKey] ?? []) : []
  const selectedLog = selectedKey ? dailyLogsByDate[selectedKey] : undefined

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this check-in?')) return
    await checkInRepository.remove(id)
    refetch()
  }

  // Recreated whenever a month's data loads, so each day button closes over
  // fresh entries/logs without needing a separate context provider.
  const CalendarDayButton = useMemo(() => {
    // a day's marks stay on a single row, so the period drop and the "+N"
    // counter each take one of these slots instead of wrapping to a second line
    const MARK_SLOTS = 3
    const DayButton = ({ day, modifiers: _modifiers, className, ...props }: DayButtonProps) => {
      const dateKey = toDateKey(day.date)
      const dayEntries = entriesByDate[dateKey]
      // one icon per distinct feeling logged that day, most recent first —
      // walk entries newest-to-oldest so a repeated word keeps its latest slot
      const dayWords: WordCard[] = []
      const seenWordIds = new Set<string>()
      for (let i = (dayEntries?.length ?? 0) - 1; i >= 0; i--) {
        const entry = dayEntries![i]
        if (seenWordIds.has(entry.wordId)) continue
        seenWordIds.add(entry.wordId)
        const card = WORD_CARDS.find((c) => c.id === entry.wordId)
        if (card) dayWords.push(card)
      }
      const hadPeriod = dailyLogsByDate[dateKey]?.hadPeriod
      const slots = hadPeriod ? MARK_SLOTS - 1 : MARK_SLOTS
      // when the words don't all fit, the last slot turns into the "+N" counter
      const visibleWords = dayWords.slice(0, dayWords.length > slots ? slots - 1 : slots)
      const extraMoodCount = dayWords.length - visibleWords.length

      return (
        <button {...props} className={`${className ?? ''} calendar-day-button`}>
          <span className="calendar-day-number">{day.date.getDate()}</span>
          <span className="calendar-day-marks">
            {visibleWords.map((word) => (
              <span key={word.id} className="calendar-day-mood" title={word.word}>
                <WordShape card={word} expressive />
              </span>
            ))}
            {extraMoodCount > 0 && (
              <span className="calendar-day-mood-more" title={`+${extraMoodCount} more`}>
                +{extraMoodCount}
              </span>
            )}
            {hadPeriod && (
              <span className="calendar-day-period" aria-label="On period">
                🩸
              </span>
            )}
          </span>
        </button>
      )
    }
    return DayButton
  }, [entriesByDate, dailyLogsByDate])

  return (
    <PageFrame>
      <Greeting />
      <div className="calendar-wrapper">
        <div className="calendar-header">
          <h1 className="text-display calendar-title">How is your journey?</h1>
        </div>

        <div className="calendar-month">
          <div className="calendar-month-nav">
            <button
              type="button"
              className="calendar-month-nav-button"
              onClick={() => setMonth((current) => addMonths(current, -1))}
              aria-label="Previous month"
            >
              <MonthChevron direction="left" />
            </button>
            <h2 className="calendar-month-title" aria-live="polite">
              {format(month, 'LLLL yyyy')}
            </h2>
            <button
              type="button"
              className="calendar-month-nav-button"
              onClick={() => setMonth((current) => addMonths(current, 1))}
              aria-label="Next month"
            >
              <MonthChevron direction="right" />
            </button>
          </div>

          <DayPicker
            mode="single"
            month={month}
            onMonthChange={setMonth}
            selected={selectedDate}
            onSelect={setSelectedDate}
            weekStartsOn={1}
            hideNavigation
            components={{ DayButton: CalendarDayButton }}
            className="calendar-picker"
          />
        </div>
      </div>
      <div className="calendar-cta">
        <Link className="calendar-add-button" to={wordsPath()}>
          Add new sensation
        </Link>
      </div>

      {selectedDate && (
        <DayLogDialog
          date={selectedDate}
          entries={selectedEntries}
          dailyLog={selectedLog}
          onClose={() => setSelectedDate(undefined)}
          onDelete={handleDelete}
        />
      )}
      <TabBar />
    </PageFrame>
  )
}
