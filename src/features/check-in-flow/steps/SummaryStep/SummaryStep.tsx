import { Trans, useLingui } from '@lingui/react/macro'
import { WordShape } from '@/entities/word'
import type { BodyZone, CheckInIntensity } from '@/entities/check-in/types'
import { vasScoreFor } from '@/entities/check-in/vasScale'
import { VAS_SCALE, bodyZoneLabel, type WordCard } from '@/i18n'
import { scaleForIntensity } from '../../intensityScale'
import './SummaryStep.css'

/** Shape's footprint at the smallest intensity — scaleForIntensity multiplies this
 * directly (rather than via CSS transform) so the stage actually reserves enough
 * room for the shape at high intensity instead of letting it overflow visually.
 * Bigger than the word-cloud/detail shapes on purpose: this is the summary's
 * hero visual, so "how big is it" should read at a glance even at max intensity. */
const SHAPE_BASE_SIZE = 130

const capitalize = (word: string): string => word.charAt(0).toUpperCase() + word.slice(1)

export const SummaryStep = ({
  word,
  bodyZones,
  intensity,
}: {
  word: WordCard
  bodyZones: BodyZone[]
  intensity: CheckInIntensity
}) => {
  const { t } = useLingui()
  const vasLevel = VAS_SCALE[vasScoreFor(word.id, intensity)]

  /** Joins zone phrases into a sentence-friendly list, e.g. "your left knee and your right knee". */
  const joinBodyZoneLabels = (zones: BodyZone[]): string => {
    const labels = zones.map(bodyZoneLabel)
    if (labels.length <= 1) return labels[0] ?? ''
    const leading = labels.slice(0, -1).join(', ')
    const last = labels[labels.length - 1]
    return t`${leading} and ${last}`
  }
  const zonesText = joinBodyZoneLabels(bodyZones)

  return (
    <div className="summary-step">
      <div className="summary-step__stage">
        <div
          className="summary-step__shape"
          style={{
            width: `${SHAPE_BASE_SIZE * scaleForIntensity(intensity)}px`,
            height: `${SHAPE_BASE_SIZE * scaleForIntensity(intensity)}px`,
          }}
        >
          <WordShape card={word} expressive />
        </div>
      </div>

      <h3 className="summary-step__heading">
        <Trans>Your body says…</Trans>
      </h3>
      <span className="summary-step__word-pill">{capitalize(word.word)}</span>

      <p className="summary-step__description">{word.description}</p>
      <p className="summary-step__location">
        <Trans>Felt in {zonesText}.</Trans>
      </p>

      <h3 className="summary-step__vas-heading">
        <Trans>Intensity scale</Trans>
      </h3>
      <div className="summary-step__vas">
        <span className="summary-step__vas-label">{vasLevel.label}.</span>{' '}
        {vasLevel.description}
      </div>

      <h3 className="summary-step__help-heading">
        <Trans>What can help right now?</Trans>
      </h3>
      <div className={`summary-step__recommendation summary-step__recommendation--${word.signal}`}>
        <p className="summary-step__recommendation-text">{word.recommendation}</p>
      </div>
    </div>
  )
}
