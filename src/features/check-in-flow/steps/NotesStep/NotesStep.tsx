import type { Energy } from '@/entities/check-in/types'
import { useDailyLog } from '@/entities/daily-log/useDailyLog'
import { todayKey } from '@/shared/lib/dateKey'
import './NotesStep.css'

const ENERGY_OPTIONS: { value: Energy; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Okay' },
  { value: 'low', label: 'Low' },
]

export const NotesStep = ({
  energy,
  onEnergyChange,
  note,
  onNoteChange,
  date,
}: {
  energy: Energy | null
  onEnergyChange: (energy: Energy) => void
  note: string
  onNoteChange: (note: string) => void
  /** day this check-in belongs to — defaults to today when editing a past day's entry */
  date?: string
}) => {
  const isToday = (date ?? todayKey()) === todayKey()
  const { hadPeriod, tookPainkiller, setHadPeriod, setTookPainkiller } = useDailyLog(
    date ?? todayKey(),
  )

  return (
    <div>
      <h2>Anything else you want to share?</h2>

      <p className="notes-step__label">Energy</p>
      <div className="notes-step__energy">
        {ENERGY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className="notes-step__energy-pill"
            aria-pressed={energy === option.value}
            onClick={() => onEnergyChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <p className="notes-step__label">{isToday ? 'On period today?' : 'On period that day?'}</p>
      <div className="notes-step__energy">
        <button
          type="button"
          className="notes-step__energy-pill"
          aria-pressed={hadPeriod === true}
          onClick={() => setHadPeriod(true)}
        >
          Yes
        </button>
        <button
          type="button"
          className="notes-step__energy-pill"
          aria-pressed={hadPeriod === false}
          onClick={() => setHadPeriod(false)}
        >
          No
        </button>
      </div>

      <p className="notes-step__label">
        {isToday ? 'Took a painkiller today?' : 'Took a painkiller that day?'}
      </p>
      <div className="notes-step__energy">
        <button
          type="button"
          className="notes-step__energy-pill"
          aria-pressed={tookPainkiller === true}
          onClick={() => setTookPainkiller(true)}
        >
          Yes
        </button>
        <button
          type="button"
          className="notes-step__energy-pill"
          aria-pressed={tookPainkiller === false}
          onClick={() => setTookPainkiller(false)}
        >
          No
        </button>
      </div>

      <p className="notes-step__label">Additional Notes</p>
      <textarea
        className="notes-step__textarea"
        value={note}
        onChange={(event) => onNoteChange(event.target.value)}
        placeholder="Anything you want to remember about this…"
      />
    </div>
  )
}
