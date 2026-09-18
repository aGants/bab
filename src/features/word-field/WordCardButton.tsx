import { useState } from 'react'
import type { WordCard } from './bodyWordsData'
import { WordShape } from './WordShape'
import { useHoverSupport } from './helpers/useHoverSupport'

export const WordCardButton = ({
  card,
  selected,
  centered,
  onSelect,
  cardRef,
}: {
  card: WordCard
  selected: boolean
  /** Whether this bubble is the one nearest the viewport's center right now —
   * the touch-device stand-in for hover (see useGridPanning's centeredId). */
  centered: boolean
  onSelect: (card: WordCard) => void
  cardRef: (el: HTMLButtonElement | null) => void
}) => {
  const [hovered, setHovered] = useState(false)
  const supportsHover = useHoverSupport()
  const centerActive = centered && !supportsHover
  const expressive = hovered || selected || centerActive

  return (
    <button
      type="button"
      ref={cardRef}
      data-word-id={card.id}
      className={`word-card${selected ? ' is-selected' : ''}${centerActive ? ' is-centered' : ''}`}
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
