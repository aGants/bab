import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll } from 'vitest'
import { activateLocale } from '@/i18n/runtime'

beforeAll(() => activateLocale('en'))

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})
