import type { ReactNode } from 'react'

const Icon = ({ size = 20, children }: { size?: number; children: ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
)

export const BackIcon = () => (
  <Icon size={24}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Icon>
)

export const CloseIcon = () => (
  <Icon size={24}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
)

export const ListIcon = () => (
  <Icon size={16}>
    <path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" strokeWidth="2.4" />
  </Icon>
)

export const ClockIcon = () => (
  <Icon size={16}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icon>
)

export const EditIcon = () => (
  <Icon size={22}>
    <path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5" />
    <path d="M18.4 3.6a1.9 1.9 0 0 1 2.7 2.7L12 15.4 8 16l.6-4z" />
  </Icon>
)

export const PlusIcon = () => (
  <Icon size={18}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)
