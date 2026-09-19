import { type WordCard, WordShape } from '@/features/word-field'
import type { BodyZone, CheckInIntensity } from '@/entities/check-in/types'
import { vasLevelFor } from '@/entities/check-in/vasScale'
import { bodyZoneLabel } from '@/entities/check-in/bodyZoneLabel'
import { scaleForIntensity } from '../../intensityScale'
import './SummaryStep.css'

/** Shape's footprint at the smallest intensity — scaleForIntensity multiplies this
 * directly (rather than via CSS transform) so the stage actually reserves enough
 * room for the shape at high intensity instead of letting it overflow visually.
 * Bigger than the word-cloud/detail shapes on purpose: this is the summary's
 * hero visual, so "how big is it" should read at a glance even at max intensity. */
const SHAPE_BASE_SIZE = 130

const capitalize = (word: string): string => word.charAt(0).toUpperCase() + word.slice(1)

/** Joins zone phrases into a sentence-friendly list, e.g. "your left knee and your right knee". */
const joinBodyZoneLabels = (zones: BodyZone[]): string => {
  const labels = zones.map(bodyZoneLabel)
  if (labels.length <= 1) return labels[0] ?? ''
  return `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`
}

export const SummaryStep = ({
  word,
  bodyZones,
  intensity,
}: {
  word: WordCard
  bodyZones: BodyZone[]
  intensity: CheckInIntensity
}) => {
  const vasLevel = vasLevelFor(word.id, intensity)

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

      <h3 className="summary-step__heading">Your body says…</h3>
      <span className="summary-step__word-pill">{capitalize(word.word)}</span>

      <p className="summary-step__description">{word.description}</p>
      <p className="summary-step__location">Felt in {joinBodyZoneLabels(bodyZones)}.</p>

      <div className="summary-step__vas">
        <span className="summary-step__vas-label">{vasLevel.label}.</span>{' '}
        {vasLevel.description}
      </div>

      <h3 className="summary-step__help-heading">What can help right now?</h3>
      <div className={`summary-step__recommendation summary-step__recommendation--${word.signal}`}>
        <p className="summary-step__recommendation-text">{word.recommendation}</p>
      </div>
    </div>
  )
}
