import { DEFAULT_CHECK_IN_INTENSITY, type CheckInIntensity } from '@/entities/check-in/types'
import type { WordCard } from '@/features/word-field/bodyWordsData'
import { WordShape } from '@/features/word-field/WordShape'
import './IntensityStep.css'

const MIN_INTENSITY = 1
const MAX_INTENSITY = 10

/** Maps intensity (1..10) to a visual size multiplier for the shape — tiny at 1,
 * dramatically larger at 10, so "how big is it" reads literally and viscerally. */
const scaleForIntensity = (intensity: number): number => {
  const t = (intensity - MIN_INTENSITY) / (MAX_INTENSITY - MIN_INTENSITY)
  return 0.35 + t * 1.85
}

export const IntensityStep = ({
  word,
  value,
  onSelect,
}: {
  word: WordCard
  value: CheckInIntensity | null
  onSelect: (intensity: CheckInIntensity) => void
}) => {
  const level = value ?? DEFAULT_CHECK_IN_INTENSITY

  return (
    <div className="intensity-step">
      <h2>How big is it?</h2>
      <div className="intensity-step__stage">
        <div
          className="intensity-step__shape"
          style={{ transform: `scale(${scaleForIntensity(level)})` }}
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
        value={level}
        onChange={(event) => onSelect(Number(event.target.value) as CheckInIntensity)}
        aria-label="How big is it"
      />
      <div className="intensity-step__scale-labels">
        <span>Tiny</span>
        <span>Huge</span>
      </div>
    </div>
  )
}
