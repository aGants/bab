import type { ButtonHTMLAttributes } from 'react'
import { useLingui } from '@lingui/react/macro'
import './ArrowButton.css'

type Direction = 'left' | 'right'

export const ArrowButton = ({
  direction,
  'aria-label': ariaLabel,
  ...props
}: {
  direction: Direction
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>) => {
  const { t } = useLingui()
  return (
    <button
      type="button"
      className="arrow-button"
      aria-label={ariaLabel ?? (direction === 'left' ? t`Back` : t`Forward`)}
      {...props}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={direction === 'right' ? { transform: 'scaleX(-1)' } : undefined}
      >
        <path d="M19 12H5M12 5L5 12L12 19" />
      </svg>
    </button>
  )
}
