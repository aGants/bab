import type { ButtonHTMLAttributes } from 'react'
import { useLingui } from '@lingui/react/macro'
import './ArrowButton.css'

type Direction = 'left' | 'right'

const ARROW_GLYPH: Record<Direction, string> = {
  left: '←',
  right: '→',
}

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
      {ARROW_GLYPH[direction]}
    </button>
  )
}
