import { useState } from 'react'
import { Trans, useLingui } from '@lingui/react/macro'
import { PageFrame } from '@/shared/layout'
import { Button, Greeting, TabBar, ToggleSwitch } from '@/shared/ui'
import { useTheme } from '@/features/theme/useTheme'
import { useInstallApp } from '@/features/pwa/installPrompt'
import { useUserProfile } from '@/entities/user-profile/useUserProfile'
import { LOCALES, LOCALE_NAMES, isLocale, useLocale, type Locale } from '@/i18n'
import { setLocale } from '@/i18n/runtime'
import './SettingsPage.css'

export const SettingsPage = () => {
  const { t } = useLingui()
  const { theme, setTheme } = useTheme()
  const { name, setName } = useUserProfile()
  const { status: installStatus, install } = useInstallApp()
  const locale = useLocale()
  const [languageFailed, setLanguageFailed] = useState(false)
  const themeOptions = [
    { value: 'light', label: t`Light` },
    { value: 'dark', label: t`Dark` },
  ] as const

  const handleLanguageChange = async (next: string) => {
    if (!isLocale(next)) return
    setLanguageFailed(false)
    try {
      await setLocale(next)
    } catch {
      // the catalog couldn't be loaded (offline): the current language stays active
      setLanguageFailed(true)
    }
  }

  return (
    <PageFrame>
      <Greeting />
      <div className="settings-wrapper">
        <div className="settings-header">
          <h1 className="text-display settings-title">
            <Trans>Settings</Trans>
          </h1>
        </div>

        <div className="settings-section">
          <label className="settings-label" htmlFor="settings-name">
            <Trans>Your name</Trans>
          </label>
          <input
            id="settings-name"
            className="settings-name-input"
            type="text"
            maxLength={30}
            autoComplete="given-name"
            value={name}
            placeholder={t`Girl`}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="settings-section">
          <label className="settings-label" htmlFor="settings-language">
            <Trans>Language</Trans>
          </label>
          <select
            id="settings-language"
            className="settings-select"
            value={locale}
            onChange={(event) => handleLanguageChange(event.target.value)}
          >
            {(Object.keys(LOCALES) as Locale[]).map((code) => (
              <option key={code} value={code}>
                {LOCALE_NAMES[code]}
              </option>
            ))}
          </select>
          {languageFailed && (
            <p className="settings-hint" role="alert">
              <Trans>Couldn't load this language. Check your connection and try again.</Trans>
            </p>
          )}
        </div>

        <div className="settings-section">
          <span className="settings-label">
            <Trans>Theme</Trans>
          </span>
          <ToggleSwitch options={themeOptions} value={theme} onChange={setTheme} />
        </div>

        <div className="settings-section">
          <span className="settings-label">
            <Trans>Install app</Trans>
          </span>
          {installStatus === 'installed' && (
            <p className="settings-hint">
              <Trans>The app is installed on this device.</Trans>
            </p>
          )}
          {installStatus === 'prompt' && (
            <Button onClick={install}>
              <Trans>Install app</Trans>
            </Button>
          )}
          {installStatus === 'ios-safari' && (
            <ol className="settings-hint settings-steps">
              <li>
                <Trans>Tap the Share button in Safari's toolbar.</Trans>
              </li>
              <li>
                <Trans>Choose “Add to Home Screen”.</Trans>
              </li>
              <li>
                <Trans>Tap “Add”.</Trans>
              </li>
            </ol>
          )}
          {installStatus === 'ios-other-browser' && (
            <p className="settings-hint">
              <Trans>
                On iPhone and iPad the app can only be installed from Safari. Open this page in
                Safari, then tap Share → “Add to Home Screen”.
              </Trans>
            </p>
          )}
          {installStatus === 'manual' && (
            <p className="settings-hint">
              <Trans>
                Open your browser menu and choose “Install app” (or “Add to Dock” in Safari on
                Mac).
              </Trans>
            </p>
          )}
        </div>
      </div>
      <TabBar />
    </PageFrame>
  )
}
