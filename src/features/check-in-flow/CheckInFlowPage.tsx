import { useNavigate, useParams } from 'react-router-dom'
import { WORD_CARDS } from '@/features/word-field/bodyWordsData'
import { ROUTES } from '@/routes/paths'
import { PageFrame } from '@/shared/layout'
import { CheckInFlow } from './CheckInFlow'

/** Full-screen route for the check-in wizard — its own PageFrame, its own URL,
 * so it gets a real screen and native back-button behavior for free. */
export const CheckInFlowPage = () => {
  const { wordId } = useParams<{ wordId: string }>()
  const navigate = useNavigate()
  const word = WORD_CARDS.find((card) => card.id === wordId)

  if (!word) {
    return (
      <PageFrame>
        <p>Unknown word.</p>
        <button type="button" onClick={() => navigate(ROUTES.words)}>
          Back to words
        </button>
      </PageFrame>
    )
  }

  return (
    <PageFrame>
      <CheckInFlow
        word={word}
        onCancel={() => navigate(ROUTES.words)}
        onDone={() => navigate(ROUTES.checkIn)}
      />
    </PageFrame>
  )
}
