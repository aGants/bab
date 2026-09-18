import { useState, type CSSProperties } from 'react'
import { GRID_COLS, GRID_ROWS, WORD_CARDS, type WordCard } from './bodyWordsData'
import { wordColor } from './helpers/shapes'
import { WordCardButton } from './WordCardButton'
import { useGridPanning } from './helpers/useGridPanning'
import { Link } from 'react-router-dom'
import { ROUTES, checkInFlowPath } from '@/routes/paths'
import { PageFrame } from '@/shared/layout'
import './BodyWordCards.css'

export default function BodyWordCards() {
  const [selected, setSelected] = useState<WordCard | null>(null)
  const { viewportRef, detailRef, registerCard, centeredId } = useGridPanning(selected)

  return (
    <PageFrame>
      <header className="word-cards-header">
        <Link className="back-arrow" to={ROUTES.checkIn}>←</Link>
        <div>
          <h1>Body Language for Athletes</h1>
          <p>24 words to help you understand what your body feels</p>
        </div>
      </header>

      <div className="word-grid-viewport" ref={viewportRef}>
        <div
          className="word-grid"
          style={
            {
              gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
              '--grid-cols': GRID_COLS,
              '--grid-rows': GRID_ROWS,
            } as CSSProperties
          }
        >
          {WORD_CARDS.map((card) => (
            <WordCardButton
              key={card.id}
              card={card}
              selected={selected?.id === card.id}
              centered={centeredId === card.id}
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
          <strong className="word-detail-title" style={{ color: wordColor(selected.id) }}>
            {selected.word}
          </strong>
          <p className="word-detail-metaphor">{selected.metaphor}</p>
          <div className="word-detail-description">
            <p className="word-detail-feels">
            <span>IT FEELS LIKE</span>
            {selected.feelsLike}
          </p>
            <Link className="word-detail-check-in" to={checkInFlowPath(selected.id)}>→</Link>
          </div>
        </div>
      )}
    </PageFrame>
  )
}
