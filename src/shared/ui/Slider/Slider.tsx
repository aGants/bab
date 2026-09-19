import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'
import './Slider.css'

const THUMB_SIZE = 32

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/**
 * Integer slider driven by pointer events instead of a native range input:
 * iOS Safari sometimes drops taps on the native control's track and lets the
 * scroll view steal drags, so we capture the pointer and compute the value
 * from its position ourselves.
 */
export const Slider = ({
  min,
  max,
  value,
  onChange,
  label,
}: {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
  label: string
}) => {
  const progress = (value - min) / (max - min)

  const updateFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const travel = rect.width - THUMB_SIZE
    const ratio = clamp((event.clientX - rect.left - THUMB_SIZE / 2) / travel, 0, 1)
    const next = Math.round(min + ratio * (max - min))
    if (next !== value) onChange(next)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    updateFromPointer(event)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) updateFromPointer(event)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = {
      ArrowLeft: value - 1,
      ArrowDown: value - 1,
      ArrowRight: value + 1,
      ArrowUp: value + 1,
      Home: min,
      End: max,
    }[event.key]
    if (target === undefined) return
    event.preventDefault()
    onChange(clamp(target, min, max))
  }

  return (
    <div
      className="slider"
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      style={
        {
          '--slider-thumb': `${THUMB_SIZE}px`,
          '--slider-progress': progress,
        } as CSSProperties
      }
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onKeyDown={handleKeyDown}
    >
      <div className="slider__track" />
      <div className="slider__thumb" />
    </div>
  )
}
