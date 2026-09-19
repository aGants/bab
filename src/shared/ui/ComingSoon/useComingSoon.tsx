import { useEffect, useState, type ReactNode } from 'react'
import { Trans } from '@lingui/react/macro'
import './ComingSoon.css'

const VISIBLE_MS = 1800

/**
 * For controls that aren't built yet: they stay dimmed but tappable, and
 * tapping one calls `showComingSoon`. Render `comingSoonNotice` once inside a
 * positioned ancestor (the page frame) to show the "Coming soon" pill.
 */
export const useComingSoon = (): { comingSoonNotice: ReactNode; showComingSoon: () => void } => {
  // a counter rather than a boolean, so tapping again restarts the timer
  const [taps, setTaps] = useState(0)
  useEffect(() => {
    if (taps === 0) return
    const timer = window.setTimeout(() => setTaps(0), VISIBLE_MS)
    // a tap anywhere else dismisses it at once; tapping an unbuilt control again
    // still shows it, since that click lands after this pointerdown
    const dismiss = () => setTaps(0)
    document.addEventListener('pointerdown', dismiss, true)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('pointerdown', dismiss, true)
    }
  }, [taps])

  const comingSoonNotice = (
    <div className="coming-soon" role="status">
      {taps > 0 && (
        <span className="coming-soon__pill">
          <Trans>Coming soon</Trans>
        </span>
      )}
    </div>
  )
  return { comingSoonNotice, showComingSoon: () => setTaps((current) => current + 1) }
}
