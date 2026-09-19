import type { MessageDescriptor } from '@lingui/core'
import { msg } from '@lingui/core/macro'
import type { CSSProperties } from 'react'
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
  const progress = (value - MIN_INTENSITY) / (MAX_INTENSITY - MIN_INTENSITY)
  return (
    <div className="intensity-step">
      <div className="intensity-step__heading">
        <h2>
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
              <svg viewBox="0 0 13.2 13.2" width="12" height="12" fill="none" aria-hidden="true">
                <path
                  d="M6.6 9V6.6M6.6 4.2H6.606M12.6 6.6C12.6 9.91371 9.91371 12.6 6.6 12.6C3.28629 12.6 0.6 9.91371 0.6 6.6C0.6 3.28629 3.28629 0.6 6.6 0.6C9.91371 0.6 12.6 3.28629 12.6 6.6Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </p>
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
        style={{ '--slider-progress': progress } as CSSProperties}
      />

      <div className="intensity-step__stage">
        <div
          className="intensity-step__shape"
          style={{ transform: `scale(${scaleForIntensity(value)})` }}
        >
          <WordShape card={word} expressive />
        </div>
      </div>

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
