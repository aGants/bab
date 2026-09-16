import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { CATEGORIES, GRID_COLS, GRID_ROWS, WORD_CARDS, type CategoryId, type WordCard } from './bodyWordsData'
import { floatVars, shapeFor } from './shapes'
import './BodyWordCards.css'

function categoryColor(categoryId: CategoryId, intensity: number): string {
  const { hue, sat } = CATEGORIES[categoryId]
  const lightness = 68 - intensity * 8
  return `hsl(${hue} ${sat}% ${lightness}%)`
}

function WordShape({ card }: { card: WordCard }) {
  const shape = useMemo(
    () => shapeFor(card.category, card.id, card.intensity),
    [card.category, card.id, card.intensity],
  )
  const color = categoryColor(card.category, card.intensity)
  const driftStyle = useMemo(() => floatVars(card.id) as CSSProperties, [card.id])

  if (shape.kind === 'layers') {
    return (
      <svg viewBox="0 0 100 100" className="word-shape" style={driftStyle}>
        <path d={shape.path} fill={color} opacity={0.55} />
        <path d={shape.inner} fill={color} transform="translate(20 20) scale(0.6)" />
      </svg>
    )
  }

  if (shape.kind === 'filtered') {
    return (
      <svg viewBox="0 0 100 100" className="word-shape" style={driftStyle}>
        <path d={shape.path} fill={color} filter="url(#energy-wobble)" />
      </svg>
    )
  }

  // 'blob' and 'burst' both render as a single flat path
  return (
    <svg viewBox="0 0 100 100" className="word-shape" style={driftStyle}>
      <path d={shape.path} fill={color} />
    </svg>
  )
}

function EnergyFilterDefs() {
  // shared turbulence/displacement filter that gives energy & fuel shapes
  // an unstable, static-y edge instead of a clean outline
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <filter id="energy-wobble" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" />
        </filter>
      </defs>
    </svg>
  )
}

function WordCardButton({
  card,
  selected,
  onSelect,
}: {
  card: WordCard
  selected: boolean
  onSelect: (card: WordCard) => void
}) {
  return (
    <button
      type="button"
      className={`word-card${selected ? ' is-selected' : ''}`}
      style={{ gridColumn: card.col + 1, gridRow: card.row + 1 }}
      onClick={() => onSelect(card)}
      aria-pressed={selected}
    >
      <WordShape card={card} />
      <span className="word-card-label">{card.word}</span>
    </button>
  )
}

export default function BodyWordCards() {
  const [selected, setSelected] = useState<WordCard | null>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // start the pannable canvas centered on the grid
    const el = viewportRef.current
    if (!el) return
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2
    el.scrollTop = (el.scrollHeight - el.clientHeight) / 2
  }, [])

  return (
    <div className="word-cards">
      <EnergyFilterDefs />

      <header className="word-cards-header">
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
              onSelect={setSelected}
            />
          ))}
        </div>
      </div>

      {selected && (
        <div className="word-detail" role="dialog" aria-label={selected.word}>
          <button
            type="button"
            className="word-detail-close"
            onClick={() => setSelected(null)}
            aria-label="Close detail"
          >
            ✕
          </button>
          <div className="word-detail-shape">
            <WordShape card={selected} />
          </div>
          <strong className="word-detail-title" style={{ color: categoryColor(selected.category, 0) }}>
            {selected.word}
          </strong>
          <p className="word-detail-tagline">{selected.tagline}</p>
          <p className="word-detail-metaphor">{selected.metaphor}</p>
          <p className="word-detail-description">{selected.description}</p>
          <p className="word-detail-feels">
            <span>IT FEELS LIKE</span>
            {selected.feelsLike}
          </p>
        </div>
      )}
    </div>
  )
}
