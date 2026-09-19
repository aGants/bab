import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { activateLocale } from '@/i18n/runtime'
import { act, render, screen } from '@/test/render'
import { LanguagePicker } from './LanguagePicker'

const setLocaleSpy = vi.hoisted(() => vi.fn())

// The real implementation, but replaceable per test so a failing catalog load can be simulated.
vi.mock('@/i18n/runtime', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/i18n/runtime')>()
  setLocaleSpy.mockImplementation(actual.setLocale)
  return { ...actual, setLocale: setLocaleSpy }
})

describe('LanguagePicker', () => {
  afterEach(async () => {
    vi.restoreAllMocks()
    await act(() => activateLocale('en'))
  })

  it('lists each language under its own name', () => {
    render(<LanguagePicker />)
    const options = screen.getAllByRole('option').map((option) => option.textContent)
    expect(options).toEqual(['English', 'Italiano'])
  })

  it('switches to the chosen language and remembers it', async () => {
    render(<LanguagePicker />)

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Language' }), 'it')

    expect(await screen.findByRole('combobox', { name: 'Lingua' })).toHaveProperty('value', 'it')
    expect(window.localStorage.getItem('locale')).toBe('it')
  })

  it('keeps the current language and says so when the new one cannot be loaded', async () => {
    setLocaleSpy.mockRejectedValueOnce(new Error('offline'))
    render(<LanguagePicker />)

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Language' }), 'it')

    expect((await screen.findByRole('alert')).textContent).toMatch(/Couldn't load this language/)
    expect(screen.getByRole('combobox', { name: 'Language' })).toHaveProperty('value', 'en')
    expect(window.localStorage.getItem('locale')).toBeNull()
  })
})
