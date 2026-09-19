import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Trans, useLingui } from '@lingui/react/macro'
import { WordShape } from '@/entities/word'
import { useContent } from '@/i18n'
import { wordsPath } from '@/routes/paths'
import { toDateKey } from '@/shared/lib/dateKey'
import type { CheckInEntry } from '@/entities/check-in/types'
import type { DailyLog } from '@/entities/daily-log/types'
import { BackIcon, ClockIcon, CloseIcon, EditIcon, ListIcon, PlusIcon } from './icons'
import './DayLogDialog.css'

/** Everything logged on one calendar day: its check-ins (with edit/delete) and a
 * shortcut to log another. Opens when a day is picked in the calendar. */
export const DayLogDialog = ({
  date,
  entries,
  dailyLog,
  onClose,
  onDelete,
}: {
  date: Date
  entries: CheckInEntry[]
  dailyLog?: DailyLog
  onClose: () => void
  onDelete: (id: string) => void
}) => {
  const { t, i18n } = useLingui()
  const { wordCards, bodyZoneShortLabel } = useContent()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const dateKey = toDateKey(date)
  const count = entries.length

  return (
    <div className="day-log-backdrop" onClick={onClose}>
      <div
        className="day-log"
        role="dialog"
        aria-modal="true"
        aria-labelledby="day-log-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="day-log__header">
          <button type="button" className="day-log__icon-button" aria-label={t`Back`} onClick={onClose}>
            <BackIcon />
          </button>
          <h2 id="day-log-title" className="day-log__title">
            {i18n.date(date, { month: 'long', day: 'numeric', year: 'numeric' })}
          </h2>
          <button type="button" className="day-log__icon-button" aria-label={t`Close`} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {(dailyLog?.hadPeriod || dailyLog?.tookPainkiller) && (
          <div className="day-log__flags">
            {dailyLog.hadPeriod && (
              <span className="day-log__flag">
                <Trans>🩸 On period</Trans>
              </span>
            )}
            {dailyLog.tookPainkiller && (
              <span className="day-log__flag">
                <Trans>💊 Took a painkiller</Trans>
              </span>
            )}
          </div>
        )}

        {entries.length > 0 ? (
          <>
            <p className="day-log__count">
              <ListIcon />
              <Trans>Logged sensations ({count})</Trans>
            </p>
            <ul className="day-log__list">
              {entries.map((entry) => {
                const word = wordCards.find((card) => card.id === entry.wordId)
                const wordName = word?.word
                return (
                  <li key={entry.id} className="day-log__card">
                    <div className="day-log__card-top">
                      <span className="day-log__shape" aria-hidden="true">
                        {word && <WordShape card={word} expressive />}
                      </span>
                      <strong className="day-log__word">{wordName ?? t`Unknown`}</strong>
                      <Link
                        className="day-log__edit"
                        to={wordsPath(entry.date, entry.id)}
                        aria-label={wordName ? t`Edit ${wordName}` : t`Edit check-in`}
                      >
                        <EditIcon />
                      </Link>
                    </div>
                    <div className="day-log__card-bottom">
                      <span className="day-log__zones">
                        {entry.bodyZones.map((zone) => (
                          <span key={zone} className="day-log__zone">
                            {bodyZoneShortLabel(zone)}
                          </span>
                        ))}
                      </span>
                      <span className="day-log__time">
                        <ClockIcon />
                        {i18n.date(new Date(entry.createdAt), { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                    {entry.note && <p className="day-log__note">{entry.note}</p>}
                    <button
                      type="button"
                      className="day-log__delete"
                      onClick={() => onDelete(entry.id)}
                    >
                      <Trans>Delete</Trans>
                    </button>
                  </li>
                )
              })}
            </ul>
          </>
        ) : (
          <p className="day-log__empty">
            <Trans>No check-ins this day.</Trans>
          </p>
        )}

        <Link className="day-log__add" to={wordsPath(dateKey)}>
          <PlusIcon />
          {entries.length > 0 ? t`Log another sensation` : t`Log a sensation`}
        </Link>
      </div>
    </div>
  )
}
