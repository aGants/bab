import { Trans, useLingui } from '@lingui/react/macro'
import { DEFAULT_ENERGY, type Energy } from '@/entities/check-in/types'
import { useDailyLog } from '@/entities/daily-log/useDailyLog'
import { todayKey } from '@/shared/lib/dateKey'
import { Slider } from '@/shared/ui'
import './NotesStep.css'

const MIN_ENERGY = 1
const MAX_ENERGY = 7

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

  const binaryQuestion = (
    label: string,
    answer: boolean | null | undefined,
    onAnswer: (value: boolean) => void,
  ) => (
    <div className="notes-step__field">
      <p className="notes-step__label">{label}</p>
      <div className="notes-step__binary">
        <button
          type="button"
          className="notes-step__pill"
          aria-pressed={answer === true}
          onClick={() => onAnswer(true)}
        >
          <Trans>Yes</Trans>
        </button>
        <button
          type="button"
          className="notes-step__pill"
          aria-pressed={answer === false}
          onClick={() => onAnswer(false)}
        >
          <Trans>No</Trans>
        </button>
      </div>
    </div>
  )

  return (
    <div className="notes-step">
      <h2>
        <Trans>Anything else you want to share?</Trans>
      </h2>

      <div className="notes-step__field">
        <p className="notes-step__label">
          <Trans>Energy level</Trans>
        </p>
        <Slider
          min={MIN_ENERGY}
          max={MAX_ENERGY}
          value={energyLevel}
          onChange={(energyValue) => onEnergyChange(energyValue as Energy)}
          label={t`Energy level`}
        />
        <div className="notes-step__energy-ends">
          <span>
            <Trans>Low</Trans>
          </span>
          <span>
            <Trans>High</Trans>
          </span>
        </div>
      </div>

      {binaryQuestion(isToday ? t`On period today?` : t`On period that day?`, hadPeriod, setHadPeriod)}
      {binaryQuestion(
        isToday ? t`Took a painkiller today?` : t`Took a painkiller that day?`,
        tookPainkiller,
        setTookPainkiller,
      )}

      <div className="notes-step__field notes-step__field--grow">
        <label className="notes-step__label" htmlFor="notes-step-textarea">
          <Trans>Additional Notes</Trans>
        </label>
        <textarea
          id="notes-step-textarea"
          className="notes-step__textarea"
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder={t`Anything you want to remember about this…`}
        />
      </div>
    </div>
  )
}
