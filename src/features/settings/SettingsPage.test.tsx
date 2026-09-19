import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { activateLocale } from '@/i18n/runtime'
import { act, render, screen } from '@/test/render'
import { SettingsPage } from './SettingsPage'

const setLocaleSpy = vi.hoisted(() => vi.fn())

// The real implementation, but replaceable per test so a failing catalog load can be simulated.
vi.mock('@/i18n/runtime', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/i18n/runtime')>()
  setLocaleSpy.mockImplementation(actual.setLocale)
  return { ...actual, setLocale: setLocaleSpy }
})

const renderPage = () =>
  render(
    <MemoryRouter>
      <SettingsPage />
    </MemoryRouter>,
  )

describe('SettingsPage language picker', () => {
  afterEach(async () => {
    vi.restoreAllMocks()
    await act(() => activateLocale('en'))
  })

  it('lists each language under its own name', () => {
    renderPage()
    const options = screen.getAllByRole('option').map((option) => option.textContent)
    expect(options).toEqual(['English', 'Italiano'])
  })

  it('switches the page to the chosen language and remembers it', async () => {
    renderPage()

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Language' }), 'it')

    expect(await screen.findByRole('heading', { name: 'Impostazioni' })).toBeTruthy()
    expect(screen.getByRole('combobox', { name: 'Lingua' })).toHaveProperty('value', 'it')
    expect(window.localStorage.getItem('locale')).toBe('it')
  })

  it('keeps the current language and says so when the new one cannot be loaded', async () => {
    setLocaleSpy.mockRejectedValueOnce(new Error('offline'))
    renderPage()

    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Language' }), 'it')

    expect((await screen.findByRole('alert')).textContent).toMatch(/Couldn't load this language/)
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeTruthy()
    expect(window.localStorage.getItem('locale')).toBeNull()
  })

  it('shows the translated fallback name until the user types their own', () => {
    renderPage()
    expect(screen.getByPlaceholderText('Girl')).toBeTruthy()
  })
})
