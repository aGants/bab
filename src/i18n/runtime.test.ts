import { i18n } from '@lingui/core'
import { describe, expect, it } from 'vitest'
import { getInitialLocale, setLocale } from './runtime'

describe('locale runtime', () => {
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

  it('ignores a stored language the app does not ship', () => {
    window.localStorage.setItem('locale', 'xx')

    expect(getInitialLocale()).toBe('en')
  })
})
