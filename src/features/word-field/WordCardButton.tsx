import { useMemo } from 'react'
import { WordShape, wordLabelColor } from '@/entities/word'
import type { GridWord } from './wordGrid'

/** How many grid steps out a neighbour still gets pushed, and how far (in px)
 * the closest ones move — tapers to 0 at PUSH_RADIUS, so only cards actually
 * next to the selected one make room for it; the rest of the field stays put. */
const PUSH_RADIUS = 2
const PUSH_STRENGTH = 26

export const WordCardButton = ({
  card,
  selected,
  onSelect,
  cardRef,
}: {
  card: GridWord
  /** The single card selected across the whole field, or null — each button
   * figures out for itself whether that's this card, or a neighbour that
   * should retreat away from it. */
  selected: GridWord | null
  onSelect: (card: GridWord) => void
  cardRef: (el: HTMLButtonElement | null) => void
}) => {
  const isSelected = selected?.id === card.id

  const push = useMemo(() => {
    if (!selected || isSelected) return null
    const dCol = card.col - selected.col
    const dRow = card.row - selected.row
    const dist = Math.hypot(dCol, dRow)
    if (dist === 0 || dist > PUSH_RADIUS) return null
    const magnitude = PUSH_STRENGTH * (1 - dist / PUSH_RADIUS)
    return { x: (dCol / dist) * magnitude, y: (dRow / dist) * magnitude }
  }, [selected, isSelected, card.col, card.row])

  return (
    <button
      type="button"
      ref={cardRef}
      data-word-id={card.id}
      className={`word-card${isSelected ? ' is-selected' : ''}`}
      style={{
        gridColumn: card.col + 1,
        gridRow: card.row + 1,
        transform: push ? `translate(${push.x}px, ${push.y}px)` : undefined,
      }}
      onClick={() => onSelect(card)}
      aria-pressed={isSelected}
    >
      <WordShape card={card} expressive={isSelected} />
      <span className="word-card-label" style={{ color: wordLabelColor(card.id) }}>
        {card.word}
      </span>
    </button>
  )
}
