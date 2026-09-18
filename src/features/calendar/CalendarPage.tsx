import { useMemo, useState } from 'react'
import { DayPicker, type DayButtonProps } from 'react-day-picker'
import 'react-day-picker/style.css'
import { Link, useSearchParams } from 'react-router-dom'
import { PageFrame } from '@/shared/layout'
import { Greeting, TabBar } from '@/shared/ui'
import { toDateKey } from '@/shared/lib/dateKey'
import { WordShape } from '@/features/word-field/WordShape'
import { CATEGORIES, WORD_CARDS } from '@/features/word-field/bodyWordsData'
import { wordsPath } from '@/routes/paths'
import { checkInRepository } from '@/entities/check-in/checkInRepository'
import { useCalendarMonthData } from './useCalendarMonthData'
import './CalendarPage.css'

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
    const DayButton = ({ day, modifiers: _modifiers, className, ...props }: DayButtonProps) => {
      const dateKey = toDateKey(day.date)
      const dayEntries = entriesByDate[dateKey]
      // most recent check-in of the day is the one shown as the day's "feeling"
      const featuredWord = dayEntries?.length
        ? WORD_CARDS.find((card) => card.id === dayEntries[dayEntries.length - 1].wordId)
        : undefined
      const hadPeriod = dailyLogsByDate[dateKey]?.hadPeriod

      return (
        <button {...props} className={`${className ?? ''} calendar-day-button`}>
          <span className="calendar-day-number">{day.date.getDate()}</span>
          <span className="calendar-day-marks">
            {featuredWord && (
              <span className="calendar-day-mood" title={featuredWord.word}>
                <WordShape card={featuredWord} />
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
      <div className="calendar-wrapper">
        <Greeting />
        <div className="calendar-header">
          <h1 className="text-display calendar-title">Calendar</h1>
        </div>

        <DayPicker
          mode="single"
          month={month}
          onMonthChange={setMonth}
          selected={selectedDate}
          onSelect={setSelectedDate}
          showOutsideDays
          components={{ DayButton: CalendarDayButton }}
          className="calendar-picker"
        />

        {selectedKey && (
          <div className="calendar-detail">
            <div className="calendar-detail-heading">
              <h2 className="calendar-detail-date">{selectedKey}</h2>
              <Link className="calendar-detail-add" to={wordsPath(selectedKey ?? undefined)}>
                + Add check-in
              </Link>
            </div>

            {(selectedLog?.hadPeriod || selectedLog?.tookPainkiller) && (
              <div className="calendar-detail-flags">
                {selectedLog?.hadPeriod && (
                  <span className="calendar-detail-flag">🩸 On period</span>
                )}
                {selectedLog?.tookPainkiller && (
                  <span className="calendar-detail-flag">💊 Took a painkiller</span>
                )}
              </div>
            )}

            {selectedEntries.length > 0 ? (
              <ul className="calendar-detail-log">
                {selectedEntries.map((entry) => {
                  const word = WORD_CARDS.find((card) => card.id === entry.wordId)
                  return (
                    <li key={entry.id} className="calendar-detail-log-item">
                      <span className="calendar-detail-log-emoji">
                        {word ? CATEGORIES[word.category].emoji : '❓'}
                      </span>
                      <div className="calendar-detail-log-details">
                        <strong>{word?.word ?? 'Unknown'}</strong>
                        <span className="calendar-detail-log-meta">
                          {entry.bodyZones.join(', ')} · intensity {entry.intensity}
                        </span>
                        {entry.note && <p className="calendar-detail-log-note">{entry.note}</p>}
                      </div>
                      <div className="calendar-detail-log-actions">
                        <Link
                          className="calendar-detail-log-edit"
                          to={wordsPath(entry.date, entry.id)}
                          aria-label="Edit check-in"
                        >
                          ✎
                        </Link>
                        <button
                          type="button"
                          className="calendar-detail-log-delete"
                          onClick={() => handleDelete(entry.id)}
                          aria-label="Delete check-in"
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="calendar-detail-empty">No check-ins this day.</p>
            )}
          </div>
        )}
      </div>
      <TabBar />
    </PageFrame>
  )
}
