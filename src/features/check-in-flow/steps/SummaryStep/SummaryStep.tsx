import { Trans } from '@lingui/react/macro'
import { WordShape } from '@/entities/word'
import type { CheckInIntensity } from '@/entities/check-in/types'
import type { WordCard } from '@/i18n'
import { scaleForIntensity } from '../../intensityScale'
import checkHeart from './assets/check-heart.svg'
import './SummaryStep.css'

/** Shape's footprint at the smallest intensity — scaleForIntensity multiplies this
 * directly (rather than via CSS transform) so the card actually reserves enough
 * room for the shape at high intensity instead of letting it overflow visually.
 * Bigger than the word-cloud/detail shapes on purpose: this is the summary's
 * hero visual, so "how big is it" should read at a glance even at max intensity. */
const SHAPE_BASE_SIZE = 130

const capitalize = (word: string): string => word.charAt(0).toUpperCase() + word.slice(1)

export const SummaryStep = ({
  word,
  intensity,
}: {
  word: WordCard
  intensity: CheckInIntensity
}) => {
  const shapeSize = `${SHAPE_BASE_SIZE * scaleForIntensity(intensity)}px`

  return (
    <div className="summary-step">
      <div className="summary-step__hero">
        <div className="summary-step__shape" style={{ width: shapeSize, height: shapeSize }}>
          <WordShape card={word} expressive />
        </div>
      </div>

      <div className="summary-step__intro">
        <h2>{capitalize(word.word)}</h2>
        <div className="summary-step__description">
          <p>
            {word.tagline}.
            <br />
            {word.metaphor}
          </p>
          <p>{word.description}</p>
        </div>
      </div>

      <div className="summary-step__help">
        <h3 className="summary-step__help-heading">
          <Trans>What can help right now?</Trans>
        </h3>
        <div className="summary-step__recommendation">
          <img src={checkHeart} width={24} height={24} alt="" aria-hidden="true" />
          <p className="summary-step__recommendation-text">{word.recommendation}</p>
        </div>
      </div>
    </div>
  )
}
