import type { ReactNode } from 'react'
import './OptionButton.css'

/** One selectable tile in a picker grid: a thumbnail over a label. */
export const OptionButton = ({
  label,
  selected,
  onSelect,
  children,
}: {
  label: string
  selected: boolean
  onSelect: () => void
  children: ReactNode
}) => (
  <button
    type="button"
    className={`option-button${selected ? ' option-button--selected' : ''}`}
    aria-pressed={selected}
    onClick={onSelect}
  >
    <span className="option-button__thumb" aria-hidden="true">
      {children}
    </span>
    <span className="option-button__label">{label}</span>
  </button>
)
