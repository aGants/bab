import { PageFrame } from '@/shared/layout'
import { Button, Greeting, TabBar, ToggleSwitch } from '@/shared/ui'
import { useTheme } from '@/features/theme/useTheme'
import { useInstallApp } from '@/features/pwa/installPrompt'
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
  const { status: installStatus, install } = useInstallApp()

  return (
    <PageFrame>
      <Greeting />
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
            maxLength={30}
            autoComplete="given-name"
            value={name}
            placeholder={DEFAULT_NAME}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="settings-section">
          <span className="settings-label">Theme</span>
          <ToggleSwitch options={THEME_OPTIONS} value={theme} onChange={setTheme} />
        </div>

        <div className="settings-section">
          <span className="settings-label">Install app</span>
          {installStatus === 'installed' && (
            <p className="settings-hint">The app is installed on this device.</p>
          )}
          {installStatus === 'prompt' && <Button onClick={install}>Install app</Button>}
          {installStatus === 'ios-safari' && (
            <ol className="settings-hint settings-steps">
              <li>Tap the Share button in Safari's toolbar.</li>
              <li>Choose “Add to Home Screen”.</li>
              <li>Tap “Add”.</li>
            </ol>
          )}
          {installStatus === 'ios-other-browser' && (
            <p className="settings-hint">
              On iPhone and iPad the app can only be installed from Safari. Open this page in
              Safari, then tap Share → “Add to Home Screen”.
            </p>
          )}
          {installStatus === 'manual' && (
            <p className="settings-hint">
              Open your browser menu and choose “Install app” (or “Add to Dock” in Safari on
              Mac).
            </p>
          )}
        </div>
      </div>
      <TabBar />
    </PageFrame>
  )
}
