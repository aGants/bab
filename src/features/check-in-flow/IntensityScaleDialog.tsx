import { useEffect, useRef } from 'react'
import { Trans, useLingui } from '@lingui/react/macro'
import { useContent } from '@/i18n'
import type { CheckInIntensity } from '@/entities/check-in/types'
import { Button } from '@/shared/ui'
import { MAX_INTENSITY, MIN_INTENSITY } from './intensityScale'
import './IntensityScaleDialog.css'

const LEVELS = Array.from(
  { length: MAX_INTENSITY - MIN_INTENSITY + 1 },
  (_, n) => (MIN_INTENSITY + n) as CheckInIntensity,
)

/** Explains every level of the intensity scale (1–10, matching the slider — level 0
 * only exists on the summary for non-pain words). Uses the same VAS text the summary shows,
 * and highlights the one currently picked on the intensity slider. */
export const IntensityScaleDialog = ({
  level,
  onClose,
}: {
  level: CheckInIntensity
  onClose: () => void
}) => {
  const { t } = useLingui()
  const { vasScale } = useContent()
  const currentRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'center' })
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="intensity-scale-backdrop" onClick={onClose}>
      <div
        className="intensity-scale"
        role="dialog"
        aria-modal="true"
        aria-labelledby="intensity-scale-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="intensity-scale__header">
          <h3 id="intensity-scale-title" className="intensity-scale__title">
            <Trans>Intensity scale</Trans>
          </h3>
          <button type="button" className="intensity-scale__close" aria-label={t`Close`} onClick={onClose}>
            ✕
          </button>
        </div>

        <ol className="intensity-scale__numbers" aria-hidden="true">
          {LEVELS.map((n) => (
            <li key={n} className="intensity-scale__number" aria-current={n === level}>
              {n}
            </li>
          ))}
        </ol>

        <ul className="intensity-scale__levels">
          {LEVELS.map((n) => (
            <li
              key={n}
              ref={n === level ? currentRef : undefined}
              className="intensity-scale__level"
              aria-current={n === level}
            >
              <p className="intensity-scale__level-head">
                <span className="intensity-scale__level-number">{n}</span>
                <span className="intensity-scale__level-label">{vasScale[n].label}</span>
              </p>
              <p className="intensity-scale__level-description">{vasScale[n].description}</p>
            </li>
          ))}
        </ul>

        <Button onClick={onClose}>
          <Trans>Got it</Trans>
        </Button>
      </div>
    </div>
  )
}
