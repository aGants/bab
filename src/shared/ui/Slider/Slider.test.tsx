import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Slider } from './Slider'

// jsdom has no layout and no pointer capture, so fake a 232px-wide slider at x=0
// (32px thumb → the thumb centre travels from x=16 to x=216).
beforeEach(() => {
  Element.prototype.getBoundingClientRect = () =>
    ({ left: 0, right: 232, width: 232, top: 0, bottom: 44, height: 44 }) as DOMRect
  Element.prototype.setPointerCapture = vi.fn()
  Element.prototype.hasPointerCapture = vi.fn(() => true)
})

const renderSlider = (value = 4) => {
  const onChange = vi.fn()
  render(<Slider min={1} max={7} value={value} onChange={onChange} label="Energy" />)
  return { onChange, slider: screen.getByRole('slider', { name: 'Energy' }) }
}

describe('Slider', () => {
  it('exposes its range and value to assistive tech', () => {
    const { slider } = renderSlider(3)
    expect(slider.getAttribute('aria-valuemin')).toBe('1')
    expect(slider.getAttribute('aria-valuemax')).toBe('7')
    expect(slider.getAttribute('aria-valuenow')).toBe('3')
  })

  it('jumps to the tapped position, even away from the thumb', () => {
    const { onChange, slider } = renderSlider(4)
    fireEvent.pointerDown(slider, { clientX: 216, pointerId: 1 })
    expect(onChange).toHaveBeenLastCalledWith(7)
    fireEvent.pointerDown(slider, { clientX: 16, pointerId: 1 })
    expect(onChange).toHaveBeenLastCalledWith(1)
  })

  it('follows the pointer while dragging and clamps past the ends', () => {
    const { onChange, slider } = renderSlider(4)
    fireEvent.pointerDown(slider, { clientX: 116, pointerId: 1 })
    fireEvent.pointerMove(slider, { clientX: 500, pointerId: 1 })
    expect(onChange).toHaveBeenLastCalledWith(7)
    fireEvent.pointerMove(slider, { clientX: -50, pointerId: 1 })
    expect(onChange).toHaveBeenLastCalledWith(1)
  })

  it('ignores pointer moves when the pointer is not captured', () => {
    Element.prototype.hasPointerCapture = vi.fn(() => false)
    const { onChange, slider } = renderSlider(4)
    fireEvent.pointerMove(slider, { clientX: 216, pointerId: 1 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not report a change when the value stays the same', () => {
    const { onChange, slider } = renderSlider(4)
    fireEvent.pointerDown(slider, { clientX: 116, pointerId: 1 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('supports the keyboard', () => {
    const { onChange, slider } = renderSlider(4)
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(onChange).toHaveBeenLastCalledWith(5)
    fireEvent.keyDown(slider, { key: 'ArrowLeft' })
    expect(onChange).toHaveBeenLastCalledWith(3)
    fireEvent.keyDown(slider, { key: 'Home' })
    expect(onChange).toHaveBeenLastCalledWith(1)
    fireEvent.keyDown(slider, { key: 'End' })
    expect(onChange).toHaveBeenLastCalledWith(7)
  })
})
