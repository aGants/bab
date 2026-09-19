import { Trans } from '@lingui/react/macro'
import type { WordCard } from '@/i18n'
import { useWornHat } from '@/entities/avatar/wornHat'
import { WorldCharacter } from '@/features/avatar/WorldCharacter'
import checkHeart from './assets/check-heart.svg'
import './SummaryStep.css'

const capitalize = (word: string): string => word.charAt(0).toUpperCase() + word.slice(1)

export const SummaryStep = ({ word }: { word: WordCard }) => {
  const { hatId } = useWornHat()

  return (
    <div className="summary-step">
      <div className="summary-step__hero">
        <WorldCharacter headWordId={word.id} hatId={hatId} className="summary-step__character" />
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
