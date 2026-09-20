import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { WordDefinition } from './types'
import { floatVars, motifFor, wordColor, wordPath } from './shapes'
import './WordShape.css'

const DEFAULT_VIEW_BOX = '0 0 100 100'

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
 *
 * fit=true: crops the viewBox to the outline's own bounding box so the shape fills
 * its container edge to edge (small icons next to text), instead of sitting in the
 * padded circle the grid cells share.
 */
export const WordShape = ({
  card,
  expressive = false,
  fit = false,
}: {
  card: Pick<WordDefinition, 'id'>
  expressive?: boolean
  fit?: boolean
}) => {
  const pathRef = useRef<SVGPathElement>(null)
  const [viewBox, setViewBox] = useState(DEFAULT_VIEW_BOX)
  const path = useMemo(() => wordPath(card.id, !expressive), [card.id, expressive])
  const color = wordColor(card.id)
  const motif = motifFor(card.id)
  const driftStyle = useMemo(() => floatVars(card.id) as CSSProperties, [card.id])
  const className = `word-shape${MOTIF_CLASS[motif]}`

  useLayoutEffect(() => {
    if (!fit) return
    // getBBox is missing in jsdom; the default viewBox is a fine fallback there
    const box = pathRef.current?.getBBox?.()
    if (!box || !box.width || !box.height) return
    const side = Math.max(box.width, box.height)
    const x = box.x + box.width / 2 - side / 2
    const y = box.y + box.height / 2 - side / 2
    setViewBox(`${x} ${y} ${side} ${side}`)
  }, [fit, path])

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
    <svg viewBox={fit ? viewBox : DEFAULT_VIEW_BOX} className={className} style={driftStyle}>
      <path ref={pathRef} className="word-shape-path" d={path} fill={color} style={pathStyle} />
    </svg>
  )
}
