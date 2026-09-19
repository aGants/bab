import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll } from 'vitest'
import { activateLocale } from '@/i18n/runtime'

// jsdom has no matchMedia, which the theme and motion code query
window.matchMedia ??= (query: string): MediaQueryList => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
})

beforeAll(() => activateLocale('en'))

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})
