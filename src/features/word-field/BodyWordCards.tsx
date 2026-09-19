import { useEffect, useState, type CSSProperties } from 'react'
import { CATEGORIES, GRID_COLS, WORD_CARDS, type WordCard } from './bodyWordsData'
import { wordColor, wordLabelColor } from './helpers/shapes'
import { WordCardButton } from './WordCardButton'
import { useScrollToSelected } from './helpers/useScrollToSelected'
import { Link, useSearchParams } from 'react-router-dom'
import { checkInFlowPath } from '@/routes/paths'
import { PageFrame } from '@/shared/layout'
import { Greeting, TabBar } from '@/shared/ui'
import { checkInRepository } from '@/entities/check-in/checkInRepository'
import './BodyWordCards.css'

// tagline is written as a standalone cue ("Notice how springy") without its own
// end punctuation, so it can lead straight into the metaphor as one sentence pair
const joinSentences = (a: string, b: string): string => `${/[.!?]$/.test(a) ? a : `${a}.`} ${b}`

const BodyWordCards = () => {
  const [selected, setSelected] = useState<WordCard | null>(null)
  const { viewportRef, detailRef, registerCard } = useScrollToSelected(selected)
  const [searchParams] = useSearchParams()
  // present when this is the first step of logging a check-in for a past day
  // picked on the calendar, rather than today's check-in from the home screen
  const date = searchParams.get('date') ?? undefined
  // present when editing an existing check-in — its word is preselected below
  // so changing the "feeling" is just picking a different card, same as new
  const entryId = searchParams.get('entryId') ?? undefined

  useEffect(() => {
    if (!entryId) return
    checkInRepository.getById(entryId).then((entry) => {
      if (!entry) return
      const word = WORD_CARDS.find((card) => card.id === entry.wordId)
      if (word) setSelected(word)
    })
  }, [entryId])

  return (
    <PageFrame>
      <Greeting />
      <header className="word-cards-header">
        <h1>How is your body feeling today?</h1>
      </header>
      <p className="word-cards-section-label">Body sensations</p>

      <div className="word-grid-viewport" ref={viewportRef}>
        <div className="word-grid" style={{ '--grid-cols': GRID_COLS } as CSSProperties}>
          {WORD_CARDS.map((card) => (
            <WordCardButton
              key={card.id}
              card={card}
              selected={selected}
              onSelect={setSelected}
              cardRef={registerCard(card.id)}
            />
          ))}
        </div>
      </div>

      {selected && (
        <div className="word-detail" role="dialog" aria-label={selected.word} ref={detailRef}>
          <button
            type="button"
            className="word-detail-close"
            onClick={() => setSelected(null)}
            aria-label="Close detail"
          >
            ✕
          </button>
          <span className="word-detail-pill">{CATEGORIES[selected.category].label}</span>
          <strong className="word-detail-title" style={{ background: wordColor(selected.id), color: wordLabelColor(selected.id) }}>
            {selected.word}
          </strong>
          <div className="word-detail-body">
            <div className="word-detail-text">
              <p className="word-detail-cue">{joinSentences(selected.tagline, selected.metaphor)}</p>
              <p className="word-detail-feels">{selected.feelsLike}</p>
            </div>
            <Link
              className="word-detail-check-in"
              to={checkInFlowPath(selected.id, date, entryId)}
              aria-label="Continue"
            >
              →
            </Link>
          </div>
        </div>
      )}
      <TabBar />
    </PageFrame>
  )
}

export default BodyWordCards
