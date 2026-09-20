import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.css'

export const Button = ({
  children,
  className,
  ...props
}: { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button type="button" className={className ? `button ${className}` : 'button'} {...props}>
    {children}
  </button>
)
