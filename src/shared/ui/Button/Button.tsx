import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.css'

export const Button = ({
  children,
  ...props
}: { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button type="button" className="button" {...props}>
    {children}
  </button>
)
