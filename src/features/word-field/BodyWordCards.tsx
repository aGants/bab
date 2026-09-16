import { useState, type CSSProperties } from 'react'
import { GRID_COLS, GRID_ROWS, WORD_CARDS, type WordCard } from './bodyWordsData'
import { categoryColor } from './helpers/categoryColor'
import { EnergyFilterDefs, WordShape } from './WordShape'
import { WordCardButton } from './WordCardButton'
import { useGridPanning } from './helpers/useGridPanning'
import ThemeToggle from '@/features/theme/ThemeToggle'
import './BodyWordCards.css'

const BodyWordCards = () => {
  const [selected, setSelected] = useState<WordCard | null>(null)
  const { viewportRef, detailRef, registerCard } = useGridPanning(selected)

  return (
    <div className="word-cards">
      <EnergyFilterDefs />

      <header className="word-cards-header">
        <div>
          <h1>Body Language for Athletes</h1>
          <p>24 words to help you understand what your body feels</p>
        </div>
        <ThemeToggle />
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
          {/* <div className="word-detail-shape">
            <WordShape card={selected} expressive />
          </div> */}
          <strong className="word-detail-title" style={{ color: categoryColor(selected.category, 0) }}>
            {selected.word}
          </strong>
          <p className="word-detail-tagline">{selected.tagline}</p>
          {/* <p className="word-detail-metaphor">{selected.metaphor}</p> */}
          {/* <p className="word-detail-description">{selected.description}</p> */}
          <p className="word-detail-feels">
            <span>IT FEELS LIKE</span>
            {selected.feelsLike}
          </p>
        </div>
      )}
    </div>
  )
}

export default BodyWordCards
