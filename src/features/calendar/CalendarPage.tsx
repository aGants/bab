import { useEffect, useMemo, useRef, useState } from 'react'
import { DayPicker, type DayButtonProps } from 'react-day-picker'
import { format } from 'date-fns'
import 'react-day-picker/style.css'
import { Link, useSearchParams } from 'react-router-dom'
import { PageFrame } from '@/shared/layout'
import { Greeting, TabBar } from '@/shared/ui'
import { toDateKey } from '@/shared/lib/dateKey'
import { WordShape } from '@/features/word-field/WordShape'
import { CATEGORIES, WORD_CARDS, type WordCard } from '@/features/word-field/bodyWordsData'
import { wordsPath } from '@/routes/paths'
import { bodyZoneLabel } from '@/features/check-in-flow/steps/BodyLocationStep/bodyZoneMap'
import { checkInRepository } from '@/entities/check-in/checkInRepository'
import type { BodyZone } from '@/entities/check-in/types'
import { useCalendarMonthData } from './useCalendarMonthData'
import './CalendarPage.css'

/** "left quad, right knee" — zone phrases without the "your" lead-in, for compact meta lines. */
const formatZones = (zones: BodyZone[]): string =>
  zones.map((zone) => bodyZoneLabel(zone).replace(/^your /, '')).join(', ')

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

  // the grid fills the whole screen, so the panel for a picked day starts
  // below the fold — bring it into view instead of leaving it to be discovered
  const detailRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!selectedKey) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    detailRef.current?.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [selectedKey, selectedEntries.length])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this check-in?')) return
    await checkInRepository.remove(id)
    refetch()
  }

  // Recreated whenever a month's data loads, so each day button closes over
  // fresh entries/logs without needing a separate context provider.
  const CalendarDayButton = useMemo(() => {
    const MAX_VISIBLE_MOODS = 3
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
      const visibleWords = dayWords.slice(0, MAX_VISIBLE_MOODS)
      const extraMoodCount = dayWords.length - visibleWords.length
      const hadPeriod = dailyLogsByDate[dateKey]?.hadPeriod

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
          <div className="calendar-detail" ref={detailRef}>
            <div className="calendar-detail-heading">
              <h2 className="calendar-detail-date">{format(selectedDate!, 'EEE, MMM d')}</h2>
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
                          {formatZones(entry.bodyZones)} · intensity {entry.intensity}
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
