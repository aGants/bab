import { PageFrame } from '@/shared/layout'
import { TabBar, ToggleSwitch } from '@/shared/ui'
import { useTheme } from '@/features/theme/useTheme'
import { DEFAULT_NAME } from '@/entities/user-profile/userProfileRepository'
import { useUserProfile } from '@/entities/user-profile/useUserProfile'
import './SettingsPage.css'

const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
] as const

export const SettingsPage = () => {
  const { theme, setTheme } = useTheme()
  const { name, setName } = useUserProfile()

  return (
    <PageFrame>
      <div className="settings-wrapper">
        <div className="settings-header">
          <h1 className="text-display settings-title">Settings</h1>
        </div>

        <div className="settings-section">
          <label className="settings-label" htmlFor="settings-name">
            Your name
          </label>
          <input
            id="settings-name"
            className="settings-name-input"
            type="text"
            value={name}
            placeholder={DEFAULT_NAME}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="settings-section">
          <span className="settings-label">Theme</span>
          <ToggleSwitch options={THEME_OPTIONS} value={theme} onChange={setTheme} />
        </div>
      </div>
      <TabBar />
    </PageFrame>
  )
}
