import type { WordCard } from '@/features/word-field/bodyWordsData'
import { WordShape } from '@/features/word-field/WordShape'
import type { BodyZone, CheckInIntensity } from '@/entities/check-in/types'
import { bodyZoneLabel } from '../BodyLocationStep/bodyZoneMap'
import { scaleForIntensity } from '../IntensityStep/IntensityStep'
import './SummaryStep.css'

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
}) => (
  <div className="summary-step">
    <div className="summary-step__stage">
      <div
        className="summary-step__shape"
        style={{ transform: `scale(${scaleForIntensity(intensity)})` }}
      >
        <WordShape card={word} expressive />
      </div>
    </div>

    <h3 className="summary-step__heading">Your body says…</h3>
    <span className="summary-step__word-pill">{capitalize(word.word)}</span>

    <p className="summary-step__description">{word.description}</p>
    <p className="summary-step__location">Felt in {joinBodyZoneLabels(bodyZones)}.</p>

    <h3 className="summary-step__help-heading">What can help right now?</h3>
    <div className={`summary-step__recommendation summary-step__recommendation--${word.signal}`}>
      <p className="summary-step__recommendation-text">{word.recommendation}</p>
    </div>
  </div>
)
