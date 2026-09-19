import { useEffect, useState, type CSSProperties } from 'react'
import { GRID_COLS, GRID_WORDS, type GridWord } from './wordGrid'
import { WordCardButton } from './WordCardButton'
import { useScrollToSelected } from './useScrollToSelected'
import { Link, useSearchParams } from 'react-router-dom'
import { checkInFlowPath } from '@/routes/paths'
import { PageFrame } from '@/shared/layout'
import { Greeting, TabBar } from '@/shared/ui'
import { checkInRepository } from '@/entities/check-in/checkInRepository'
import './BodyWordCards.css'

const BodyWordCards = () => {
  const [selected, setSelected] = useState<GridWord | null>(null)
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
      const word = GRID_WORDS.find((card) => card.id === entry.wordId)
      if (word) setSelected(word)
    })
  }, [entryId])

  return (
    <PageFrame>
      {/* <Greeting /> */}
      <header className="word-cards-header">
        <h1>How is your body feeling today?</h1>
      </header>
      <p className="word-cards-section-label">Body sensations</p>

      <div className="word-grid-viewport" ref={viewportRef}>
        <div className="word-grid" style={{ '--grid-cols': GRID_COLS } as CSSProperties}>
          {GRID_WORDS.map((card) => (
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
          <strong className="word-detail-title">
            {selected.word}
          </strong>
          <div className="word-detail-body">
            <div className="word-detail-text">
              <p className="word-detail-tagline">{selected.tagline}</p>
              <p className="word-detail-cue">{selected.metaphor}</p>
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
