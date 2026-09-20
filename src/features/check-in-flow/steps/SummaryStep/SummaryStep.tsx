import { Trans, useLingui } from '@lingui/react/macro'
import type { WordCard } from '@/i18n'
import { useWornHat } from '@/entities/avatar/wornHat'
import { useWornBodyColor } from '@/entities/avatar/worldBodyColor'
import { WorldCharacter } from '@/features/avatar/WorldCharacter'
import checkHeart from './assets/check-heart.svg'
import './SummaryStep.css'

const capitalize = (word: string): string => word.charAt(0).toUpperCase() + word.slice(1)

export const SummaryStep = ({
  word,
  onScrollDown,
}: {
  word: WordCard
  /** jump to the end of the screen, where the save button is */
  onScrollDown: () => void
}) => {
  const { t } = useLingui()
  const { hatId } = useWornHat()
  const { bodyColorId } = useWornBodyColor()

  return (
    <div className="summary-step">
      <div className="summary-step__hero">
        <WorldCharacter headWordId={word.id} hatId={hatId} bodyColorId={bodyColorId} className="summary-step__character" />
      </div>

      <div className="summary-step__intro">
        <div className="summary-step__title-row">
          <h2>{capitalize(word.word)}</h2>
          <button
            type="button"
            className="summary-step__scroll-down"
            aria-label={t`Scroll down to save`}
            onClick={onScrollDown}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5V19M5 12L12 19L19 12" />
            </svg>
          </button>
        </div>
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
