import type { ReactNode } from 'react'
import type { MessageDescriptor } from '@lingui/core'
import { msg } from '@lingui/core/macro'
import { useLingui } from '@lingui/react/macro'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'
import './TabBar.css'

const ICON_PROPS = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const HomeIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="M4 11.5 12 4l8 7.5" />
    <path d="M6 10v9h12v-9" />
  </svg>
)

const CalendarIcon = () => (
  <svg {...ICON_PROPS}>
    <rect x="4" y="5.5" width="16" height="15" rx="2" />
    <path d="M4 10h16M8 3.5v3M16 3.5v3" />
  </svg>
)

// const AvatarIcon = () => (
//   <svg {...ICON_PROPS}>
//     <circle cx="12" cy="9" r="5" />
//     <path d="M9.5 8.5v.5M14.5 8.5v.5M10 11.2q2 1.6 4 0" />
//     <path d="M7 20v-3.5a5 5 0 0 1 10 0V20" />
//   </svg>
// )

const SettingsIcon = () => (
  <svg {...ICON_PROPS}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14.2 3H9.8l-.4 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2l.4 2.6h4.4l.4-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.07-.4.1-.8.1-1.2Z" />
  </svg>
)

const TABS: { to: string; label: MessageDescriptor; icon: () => ReactNode }[] = [
  { to: ROUTES.checkIn, label: msg`Home`, icon: HomeIcon },
  { to: ROUTES.calendar, label: msg`Journal`, icon: CalendarIcon },
  // { to: ROUTES.avatar, label: msg`Avatar`, icon: AvatarIcon },
  { to: ROUTES.settings, label: msg`Settings`, icon: SettingsIcon },
]

export const TabBar = () => {
  const { t, i18n } = useLingui()
  return (
    <nav className="tab-bar" aria-label={t`Primary`}>
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end
          className={({ isActive }) => `tab-bar-item${isActive ? ' tab-bar-item-active' : ''}`}
        >
          <span className="tab-bar-icon" aria-hidden="true">
            {tab.icon()}
          </span>
          <span className="tab-bar-label">{i18n._(tab.label)}</span>
        </NavLink>
      ))}
    </nav>
  )
}
