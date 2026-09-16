import { useMemo, type CSSProperties } from 'react'
import type { WordCard } from './bodyWordsData'
import { categoryColor } from './categoryColor'
import { floatVars, motifFor, shapeFor } from './shapes'

/**
 * expressive=false: settled near a circle, just barely hinting at the word's real shape.
 * expressive=true (hover/selected/detail view): the shape unfolds into its full,
 * intensity-driven form. Both variants share path structure, so the browser can
 * morph the `d` attribute smoothly instead of jump-cutting between them.
 */
export function WordShape({ card, expressive = false }: { card: WordCard; expressive?: boolean }) {
  const shape = useMemo(
    () => shapeFor(card.category, card.id, card.intensity, expressive),
    [card.category, card.id, card.intensity, expressive],
  )
  const color = categoryColor(card.category, card.intensity)
  const driftStyle = useMemo(() => floatVars(card.id) as CSSProperties, [card.id])
  const motifClass = motifFor(card.id) === 'pulse' ? ' word-shape--pulse' : ''
  const className = `word-shape${motifClass}`

  if (shape.kind === 'layers') {
    return (
      <svg viewBox="0 0 100 100" className={className} style={driftStyle}>
        <path className="word-shape-path" d={shape.path} fill={color} opacity={0.55} />
        <path
          className="word-shape-path"
          d={shape.inner}
          fill={color}
          transform="translate(20 20) scale(0.6)"
        />
      </svg>
    )
  }

  if (shape.kind === 'filtered') {
    return (
      <svg viewBox="0 0 100 100" className={className} style={driftStyle}>
        <path className="word-shape-path" d={shape.path} fill={color} filter="url(#energy-wobble)" />
      </svg>
    )
  }

  // 'blob' and 'burst' both render as a single flat path
  return (
    <svg viewBox="0 0 100 100" className={className} style={driftStyle}>
      <path className="word-shape-path" d={shape.path} fill={color} />
    </svg>
  )
}

/** Shared turbulence/displacement filter that gives energy & fuel shapes
 * an unstable, static-y edge instead of a clean outline. Render once per page. */
export function EnergyFilterDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <filter id="energy-wobble" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
        </filter>
      </defs>
    </svg>
  )
}
