import type { MessageDescriptor } from '@lingui/core'
import { msg } from '@lingui/core/macro'
import { Trans, useLingui } from '@lingui/react/macro'
import type { CheckInIntensity, Trigger } from '@/entities/check-in/types'
import { usesPainScale } from '@/entities/check-in/vasScale'
import { WordShape } from '@/entities/word'
import type { WordCard } from '@/i18n'
import { MAX_INTENSITY, MIN_INTENSITY, scaleForIntensity } from '../../intensityScale'
import './IntensityStep.css'

const TRIGGER_OPTIONS: { value: Trigger; label: MessageDescriptor }[] = [
  { value: 'movement', label: msg`When I move it` },
  { value: 'pressure', label: msg`When I press it` },
  { value: 'stillness', label: msg`Standing still` },
]

export const IntensityStep = ({
  word,
  value,
  onSelect,
  trigger,
  onTriggerChange,
  onOpenInfo,
}: {
  word: WordCard
  value: CheckInIntensity
  onSelect: (intensity: CheckInIntensity) => void
  trigger: Trigger | null
  onTriggerChange: (trigger: Trigger) => void
  onOpenInfo: () => void
}) => {
  const { t, i18n } = useLingui()
  return (
    <div className="intensity-step">
      <div className="intensity-step__heading">
        <h2 className="intensity-step__title">
          <Trans>How intense is it?</Trans>
        </h2>
        <p className="intensity-step__hint">
          <Trans>Adjust the size as you feel</Trans>
          {usesPainScale(word.id) && (
            <button
              type="button"
              className="intensity-step__info"
              aria-label={t`About the intensity scale`}
              onClick={onOpenInfo}
            >
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="8" cy="5" r="0.9" fill="currentColor" />
                <path d="M8 7.4v4.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </p>
      </div>
      <div className="intensity-step__stage">
        <div
          className="intensity-step__shape"
          style={{ transform: `scale(${scaleForIntensity(value)})` }}
        >
          <WordShape card={word} expressive />
        </div>
      </div>

      <input
        type="range"
        className="intensity-step__slider"
        min={MIN_INTENSITY}
        max={MAX_INTENSITY}
        step={1}
        value={value}
        onChange={(event) => onSelect(Number(event.target.value) as CheckInIntensity)}
        aria-label={t`How big is it`}
      />

      <p className="intensity-step__label">
        <Trans>When do you notice it?</Trans>
      </p>
      <div className="intensity-step__trigger-options">
        {TRIGGER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className="intensity-step__trigger-pill"
            aria-pressed={trigger === option.value}
            onClick={() => onTriggerChange(option.value)}
          >
            {i18n._(option.label)}
          </button>
        ))}
      </div>
    </div>
  )
}
