import type { CSSProperties } from 'react'
import type { MessageDescriptor } from '@lingui/core'
import { msg } from '@lingui/core/macro'
import { Trans, useLingui } from '@lingui/react/macro'
import type { CheckInIntensity, Trigger } from '@/entities/check-in/types'
import { usesPainScale } from '@/entities/check-in/vasScale'
import { WordShape } from '@/entities/word'
import type { WordCard } from '@/i18n'
import { Slider } from '@/shared/ui'
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
  triggers,
  onTriggerToggle,
  onOpenInfo,
}: {
  word: WordCard
  value: CheckInIntensity
  onSelect: (intensity: CheckInIntensity) => void
  triggers: Trigger[]
  onTriggerToggle: (trigger: Trigger) => void
  onOpenInfo: () => void
}) => {
  const { t, i18n } = useLingui()
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
              <svg viewBox="0 0 13.2 13.2" width="18" height="18" fill="none" aria-hidden="true">
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
      <div className="intensity-step__stage">
        <div
          className="intensity-step__shape"
          style={{ '--shape-scale': scaleForIntensity(value) } as CSSProperties}
        >
          <WordShape card={word} expressive />
        </div>
      </div>

      <div className="intensity-step__slider">
        <Slider
          min={MIN_INTENSITY}
          max={MAX_INTENSITY}
          value={value}
          onChange={(intensity) => onSelect(intensity as CheckInIntensity)}
          label={t`How big is it`}
        />
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
            aria-pressed={triggers.includes(option.value)}
            onClick={() => onTriggerToggle(option.value)}
          >
            {i18n._(option.label)}
          </button>
        ))}
      </div>
    </div>
  )
}
