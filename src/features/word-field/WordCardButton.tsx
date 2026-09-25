import { memo, type CSSProperties } from 'react'
import { WordShape, wordIsPale, wordLabelColor, wordLabelColorOffShape } from '@/entities/word'
import type { GridWord } from './wordGrid'

/** Everything it takes is a plain value or a stable callback, so `memo` can skip a card that
 * neither is affected by a pick nor moves for it — picking a word redraws a handful of cards,
 * not the whole field. */
export const WordCardButton = memo(({
  card,
  isSelected,
  pushX,
  pushY,
  onSelect,
  cardRef,
}: {
  card: GridWord
  isSelected: boolean
  /** How far (px) a pick nearby pushes this card away; 0 and 0 when it stays put. */
  pushX: number
  pushY: number
  onSelect: (card: GridWord) => void
  cardRef: (el: HTMLButtonElement | null) => void
}) => {
  const offShapeColor = wordLabelColorOffShape(card.id, false)
  const offShapeColorSelected = wordLabelColorOffShape(card.id, true)

  return (
    <button
      type="button"
      ref={cardRef}
      data-word-id={card.id}
      className={`word-card${isSelected ? ' is-selected' : ''}${wordIsPale(card.id) ? ' word-card--pale' : ''}`}
      style={{
        gridColumn: card.col + 1,
        gridRow: card.row + 1,
        transform: pushX || pushY ? `translate(${pushX}px, ${pushY}px)` : undefined,
      }}
      onClick={() => onSelect(card)}
      aria-pressed={isSelected}
    >
      <WordShape card={card} expressive={isSelected} />
      <span
        className={`word-card-label${offShapeColor ? ' word-card-label--blend' : ''}`}
        style={
          {
            '--label-color': wordLabelColor(card.id),
            '--label-color-off-shape': offShapeColor ?? undefined,
            '--label-color-off-shape-selected': offShapeColorSelected ?? undefined,
          } as CSSProperties
        }
      >
        {card.word}
      </span>
    </button>
  )
})
