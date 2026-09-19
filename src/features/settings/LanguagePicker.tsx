import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { LOCALES, LOCALE_NAMES, isLocale, useLocale, type Locale } from '@/i18n'
import { setLocale } from '@/i18n/runtime'

/** Language selector for the Settings page. Each language is listed under its own name. */
export const LanguagePicker = () => {
  const locale = useLocale()
  const [failed, setFailed] = useState(false)

  const handleChange = async (next: string) => {
    if (!isLocale(next)) return
    setFailed(false)
    try {
      await setLocale(next)
    } catch {
      // the catalog couldn't be loaded (offline): the current language stays active
      setFailed(true)
    }
  }

  return (
    <div className="settings-section">
      <label className="settings-label" htmlFor="settings-language">
        <Trans>Language</Trans>
      </label>
      <select
        id="settings-language"
        className="settings-select"
        value={locale}
        onChange={(event) => handleChange(event.target.value)}
      >
        {(Object.keys(LOCALES) as Locale[]).map((code) => (
          <option key={code} value={code}>
            {LOCALE_NAMES[code]}
          </option>
        ))}
      </select>
      {failed && (
        <p className="settings-hint" role="alert">
          <Trans>Couldn't load this language. Check your connection and try again.</Trans>
        </p>
      )}
    </div>
  )
}
