import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { WordCard } from '../bodyWordsData'

/** Shrinks the observed root down to this central fraction of the viewport —
 * small enough that only bubble(s) actually near the middle qualify as
 * candidates, large enough to reliably contain one even mid-pan. */
const CENTER_ZONE_MARGIN = '-35%'

/**
 * Drives the pannable word-cloud viewport: centers it on the whole grid once on
 * mount, then re-centers on whichever card is selected so it lands in the space
 * left above the detail sheet instead of staying wherever it was clicked.
 */
export const useGridPanning = (selected: WordCard | null) => {
  const viewportRef = useRef<HTMLDivElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  // one stable ref-callback per card id, so passing `registerCard(id)` to a button
  // doesn't hand React a new function (and re-fire the ref) on every render
  const cardRefCallbacks = useRef<Record<string, (el: HTMLButtonElement | null) => void>>({})
  // bubbles currently inside the center zone, so the nearest one can be picked
  // even when several overlap it near a grid seam
  const centerCandidates = useRef<Map<string, DOMRectReadOnly>>(new Map())
  const [centeredId, setCenteredId] = useState<string | null>(null)

  const registerCard = (id: string) => {
    return (cardRefCallbacks.current[id] ??= (el) => {
      cardRefs.current[id] = el
    })
  }

  useEffect(() => {
    // start the pannable canvas centered on the grid
    const el = viewportRef.current
    if (!el) return
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2
    el.scrollTop = (el.scrollHeight - el.clientHeight) / 2
  }, [])

  useEffect(() => {
    // on touch devices there's no hover to reveal a bubble's full shape, so
    // whichever bubble panning has aimed nearest the viewport's center stands
    // in for it instead
    const viewport = viewportRef.current
    if (!viewport) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.wordId
          if (!id) continue
          if (entry.isIntersecting) {
            centerCandidates.current.set(id, entry.boundingClientRect)
          } else {
            centerCandidates.current.delete(id)
          }
        }

        const rootBounds = entries[0]?.rootBounds
        if (!rootBounds) return
        const centerX = rootBounds.left + rootBounds.width / 2
        const centerY = rootBounds.top + rootBounds.height / 2

        let closestId: string | null = null
        let closestDist = Infinity
        for (const [id, rect] of centerCandidates.current) {
          const dx = rect.left + rect.width / 2 - centerX
          const dy = rect.top + rect.height / 2 - centerY
          const dist = dx * dx + dy * dy
          if (dist < closestDist) {
            closestDist = dist
            closestId = id
          }
        }
        setCenteredId(closestId)
      },
      { root: viewport, rootMargin: CENTER_ZONE_MARGIN, threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    for (const card of Object.values(cardRefs.current)) {
      if (card) observer.observe(card)
    }

    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    // pan the canvas so the selected bubble lands centered in whatever
    // viewport space is left above the detail sheet, instead of staying
    // wherever it happened to be when clicked
    if (!selected) return
    const viewport = viewportRef.current
    const card = cardRefs.current[selected.id]
    if (!viewport || !card) return

    const viewportRect = viewport.getBoundingClientRect()
    const cardRect = card.getBoundingClientRect()
    const detailRect = detailRef.current?.getBoundingClientRect()

    const cardCenterX = cardRect.left - viewportRect.left + viewport.scrollLeft + cardRect.width / 2
    const cardCenterY = cardRect.top - viewportRect.top + viewport.scrollTop + cardRect.height / 2

    const visibleBottom = detailRect ? Math.min(viewportRect.bottom, detailRect.top) : viewportRect.bottom
    const visibleHeight = Math.max(visibleBottom - viewportRect.top, 0)

    const targetLeft = cardCenterX - viewport.clientWidth / 2
    const targetTop = cardCenterY - visibleHeight / 2

    const maxLeft = viewport.scrollWidth - viewport.clientWidth
    const maxTop = viewport.scrollHeight - viewport.clientHeight
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    viewport.scrollTo({
      left: Math.min(Math.max(targetLeft, 0), maxLeft),
      top: Math.min(Math.max(targetTop, 0), maxTop),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }, [selected])

  return { viewportRef, detailRef, registerCard, centeredId }
}
