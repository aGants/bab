import { i18n } from '@lingui/core'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LANGUAGE_SELECTION_ENABLED } from './locales'
import { getInitialLocale, setLocale } from './runtime'

describe('locale runtime', () => {
  afterEach(() => vi.restoreAllMocks())

  it('opens in the default language when nothing else is known', () => {
    expect(getInitialLocale()).toBe('en')
  })

  it('activates a language and remembers it for the next launch', async () => {
    await setLocale('en')

    expect(i18n.locale).toBe('en')
    expect(document.documentElement.lang).toBe('en')
    expect(window.localStorage.getItem('locale')).toBe('en')
    expect(getInitialLocale()).toBe('en')
  })

  it('follows the browser language only once language selection is enabled', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['it-IT', 'en'])

    expect(getInitialLocale()).toBe(LANGUAGE_SELECTION_ENABLED ? 'it' : 'en')
  })

  it('still honours a stored language, so a second language can be tried before it ships', () => {
    window.localStorage.setItem('locale', 'it')

    expect(getInitialLocale()).toBe('it')
  })

  it('ignores a stored language the app does not ship', () => {
    window.localStorage.setItem('locale', 'xx')

    expect(getInitialLocale()).toBe('en')
  })
})
