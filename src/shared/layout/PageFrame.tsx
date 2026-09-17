import type { ReactNode } from 'react'
import './PageFrame.css'

/**
 * Shared page shell: full-bleed on mobile, a fixed phone-proportioned
 * frame on desktop. Every route renders inside this so screen size and
 * shape stay consistent across the app.
 */
export const PageFrame = ({ children }: { children: ReactNode }) => (
  <div className="page-frame">{children}</div>
)
