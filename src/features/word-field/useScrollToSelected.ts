import { useLayoutEffect, useRef } from 'react'
import type { GridWord } from './wordGrid'

/**
 * Keeps a DOM ref per card so that whichever one gets selected can be
 * scrolled into the viewport space left above the detail sheet, instead of
 * staying wherever it happened to be when clicked.
 */
export const useScrollToSelected = (selected: GridWord | null) => {
  const viewportRef = useRef<HTMLDivElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  // one stable ref-callback per card id, so passing `registerCard(id)` to a button
  // doesn't hand React a new function (and re-fire the ref) on every render
  const cardRefCallbacks = useRef<Record<string, (el: HTMLButtonElement | null) => void>>({})

  const registerCard = (id: string) => {
    return (cardRefCallbacks.current[id] ??= (el) => {
      cardRefs.current[id] = el
    })
  }

  useLayoutEffect(() => {
    if (!selected) return
    const viewport = viewportRef.current
    const card = cardRefs.current[selected.id]
    if (!viewport || !card) return

    const viewportRect = viewport.getBoundingClientRect()
    const cardRect = card.getBoundingClientRect()
    const detailRect = detailRef.current?.getBoundingClientRect()

    const cardCenterY = cardRect.top - viewportRect.top + viewport.scrollTop + cardRect.height / 2

    const visibleBottom = detailRect ? Math.min(viewportRect.bottom, detailRect.top) : viewportRect.bottom
    const visibleHeight = Math.max(visibleBottom - viewportRect.top, 0)

    const targetTop = cardCenterY - visibleHeight / 2
    const maxTop = viewport.scrollHeight - viewport.clientHeight
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    viewport.scrollTo({
      top: Math.min(Math.max(targetTop, 0), maxTop),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }, [selected])

  return { viewportRef, detailRef, registerCard }
}
