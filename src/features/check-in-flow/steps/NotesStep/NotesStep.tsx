import { Trans, useLingui } from '@lingui/react/macro'
import { DEFAULT_ENERGY, type Energy } from '@/entities/check-in/types'
import { useDailyLog } from '@/entities/daily-log/useDailyLog'
import { todayKey } from '@/shared/lib/dateKey'
import './NotesStep.css'

const ENERGY_LEVELS: Energy[] = [1, 2, 3, 4, 5, 6, 7]

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
  const { t } = useLingui()
  const isToday = (date ?? todayKey()) === todayKey()
  const { hadPeriod, tookPainkiller, setHadPeriod, setTookPainkiller } = useDailyLog(
    date ?? todayKey(),
  )
  const energyLevel = energy ?? DEFAULT_ENERGY

  return (
    <div className="notes-step">
      <h2>
        <Trans>Anything else you want to share?</Trans>
      </h2>

      <p className="notes-step__label">
        <Trans>Energy</Trans>
      </p>
      <div className="notes-step__energy-scale">
        <input
          type="range"
          className="notes-step__energy-slider"
          min={1}
          max={7}
          step={1}
          value={energyLevel}
          onChange={(event) => onEnergyChange(Number(event.target.value) as Energy)}
          aria-label={t`Energy level`}
        />
        <div className="notes-step__energy-numbers">
          {ENERGY_LEVELS.map((level) => (
            <span
              key={level}
              className="notes-step__energy-number"
              data-active={level === energyLevel}
            >
              {level}
            </span>
          ))}
        </div>
      </div>

      <p className="notes-step__label">{isToday ? t`On period today?` : t`On period that day?`}</p>
      <div className="notes-step__energy">
        <button
          type="button"
          className="notes-step__energy-pill"
          aria-pressed={hadPeriod === true}
          onClick={() => setHadPeriod(true)}
        >
          <Trans>Yes</Trans>
        </button>
        <button
          type="button"
          className="notes-step__energy-pill"
          aria-pressed={hadPeriod === false}
          onClick={() => setHadPeriod(false)}
        >
          <Trans>No</Trans>
        </button>
      </div>

      <p className="notes-step__label">
        {isToday ? t`Took a painkiller today?` : t`Took a painkiller that day?`}
      </p>
      <div className="notes-step__energy">
        <button
          type="button"
          className="notes-step__energy-pill"
          aria-pressed={tookPainkiller === true}
          onClick={() => setTookPainkiller(true)}
        >
          <Trans>Yes</Trans>
        </button>
        <button
          type="button"
          className="notes-step__energy-pill"
          aria-pressed={tookPainkiller === false}
          onClick={() => setTookPainkiller(false)}
        >
          <Trans>No</Trans>
        </button>
      </div>

      <p className="notes-step__label">
        <Trans>Additional Notes</Trans>
      </p>
      <textarea
        className="notes-step__textarea"
        value={note}
        onChange={(event) => onNoteChange(event.target.value)}
        placeholder={t`Anything you want to remember about this…`}
      />
    </div>
  )
}
