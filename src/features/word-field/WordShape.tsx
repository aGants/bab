import { useMemo, type CSSProperties } from 'react'
import type { WordCard } from './bodyWordsData'
import { floatVars, motifFor, wordColor, wordPath } from './helpers/shapes'

/**
 * expressive=false: settled near a circle, just barely hinting at the word's real shape.
 * expressive=true (hover/selected): the shape unfolds into its full, hand-authored
 * form. Both variants share point count and line style, so the browser morphs the
 * `d` attribute smoothly instead of jump-cutting between them.
 */
export const WordShape = ({ card, expressive = false }: { card: WordCard; expressive?: boolean }) => {
  const path = useMemo(() => wordPath(card.id, !expressive), [card.id, expressive])
  const color = wordColor(card.id)
  const driftStyle = useMemo(() => floatVars(card.id) as CSSProperties, [card.id])
  const motifClass = motifFor(card.id) === 'pulse' ? ' word-shape--pulse' : ''
  const className = `word-shape${motifClass}`

  return (
    <svg viewBox="0 0 100 100" className={className} style={driftStyle}>
      <path className="word-shape-path" d={path} fill={color} />
    </svg>
  )
}
