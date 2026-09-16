import { useState } from 'react'
import type { WordCard } from './bodyWordsData'
import { WordShape } from './WordShape'

export const WordCardButton = ({
  card,
  selected,
  onSelect,
  cardRef,
}: {
  card: WordCard
  selected: boolean
  onSelect: (card: WordCard) => void
  cardRef: (el: HTMLButtonElement | null) => void
}) => {
  const [hovered, setHovered] = useState(false)
  const expressive = hovered || selected

  return (
    <button
      type="button"
      ref={cardRef}
      className={`word-card${selected ? ' is-selected' : ''}`}
      style={{ gridColumn: card.col + 1, gridRow: card.row + 1 }}
      onClick={() => onSelect(card)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-pressed={selected}
    >
      <WordShape card={card} expressive={expressive} />
      <span className="word-card-label">{card.word}</span>
    </button>
  )
}
