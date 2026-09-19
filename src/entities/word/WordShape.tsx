import { useMemo, type CSSProperties } from 'react'
import type { WordDefinition } from './types'
import { floatVars, motifFor, wordColor, wordPath } from './shapes'
import './WordShape.css'

const MOTIF_CLASS: Record<ReturnType<typeof motifFor>, string> = {
  pulse: ' word-shape--pulse',
  spike: ' word-shape--spike',
  jitter: ' word-shape--jitter',
  rise: ' word-shape--rise',
  heat: ' word-shape--heat',
  drift: '',
}

/**
 * expressive=false: settled near a circle, just barely hinting at the word's real shape.
 * expressive=true (hover/selected): the shape unfolds into its full, hand-authored
 * form. Both variants share point count and line style, so the browser morphs the
 * `d` attribute smoothly instead of jump-cutting between them.
 */
export const WordShape = ({ card, expressive = false }: { card: Pick<WordDefinition, 'id'>; expressive?: boolean }) => {
  const path = useMemo(() => wordPath(card.id, !expressive), [card.id, expressive])
  const color = wordColor(card.id)
  const motif = motifFor(card.id)
  const driftStyle = useMemo(() => floatVars(card.id) as CSSProperties, [card.id])
  const className = `word-shape${MOTIF_CLASS[motif]}`

  // Spiky words loop between their own full and calm paths (see spike-breathe in
  // BodyWordCards.css) — handed over as CSS vars since the path strings are per-word.
  const pathStyle: CSSProperties | undefined =
    motif === 'spike'
      ? ({
          '--word-shape-full': `path("${wordPath(card.id, false)}")`,
          '--word-shape-calm': `path("${wordPath(card.id, true)}")`,
        } as CSSProperties)
      : undefined

  return (
    <svg viewBox="0 0 100 100" className={className} style={driftStyle}>
      <path className="word-shape-path" d={path} fill={color} style={pathStyle} />
    </svg>
  )
}
