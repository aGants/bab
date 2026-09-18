import { useState } from 'react'

/** True on devices with a real pointer (mouse/trackpad) that can hover without
 * touching; false on touch-only devices, where hover-driven UI needs a
 * substitute (see `centeredId` in useGridPanning). */
export const useHoverSupport = (): boolean => {
  const [supportsHover] = useState(() =>
    typeof window === 'undefined' ? true : window.matchMedia('(hover: hover)').matches,
  )
  return supportsHover
}
