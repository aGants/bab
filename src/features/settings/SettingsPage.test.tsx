import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { LANGUAGE_SELECTION_ENABLED } from '@/i18n'
import { render, screen } from '@/test/render'
import { SettingsPage } from './SettingsPage'

const renderPage = () =>
  render(
    <MemoryRouter>
      <SettingsPage />
    </MemoryRouter>,
  )

describe('SettingsPage', () => {
  it('shows the translated fallback name until the user types their own', () => {
    renderPage()
    expect(screen.getByPlaceholderText('Girl')).toBeTruthy()
  })

  it('offers the language picker only while language selection is enabled', () => {
    renderPage()
    const picker = screen.queryByRole('combobox', { name: 'Language' })
    expect(picker !== null).toBe(LANGUAGE_SELECTION_ENABLED)
  })
})
