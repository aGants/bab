import { NavLink } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'
import './TabBar.css'

const TABS = [
  { to: ROUTES.checkIn, label: 'Home', icon: '🏠' },
  { to: ROUTES.calendar, label: 'Calendar', icon: '📅' },
  { to: ROUTES.settings, label: 'Settings', icon: '⚙️' },
] as const

export const TabBar = () => (
  <nav className="tab-bar" aria-label="Primary">
    {TABS.map((tab) => (
      <NavLink
        key={tab.to}
        to={tab.to}
        end
        className={({ isActive }) => `tab-bar-item${isActive ? ' tab-bar-item-active' : ''}`}
      >
        <span className="tab-bar-icon" aria-hidden="true">
          {tab.icon}
        </span>
        <span className="tab-bar-label">{tab.label}</span>
      </NavLink>
    ))}
  </nav>
)
