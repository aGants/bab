import { render, screen, waitFor, within } from '@/test/render'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { checkInRepository } from '@/entities/check-in/checkInRepository'
import { AvatarPage } from './AvatarPage'

const renderPage = async () => {
  const utils = render(
    <MemoryRouter>
      <AvatarPage />
    </MemoryRouter>,
  )
  // the page renders the character only once both stores have answered
  await screen.findByRole('img', { name: /Your character/ })
  return utils
}

const character = () => screen.getByRole('img', { name: /Your character/ })
const stored = () => JSON.parse(window.localStorage.getItem('avatar') ?? 'null')

const checkIn = (wordId: string, date?: string) =>
  checkInRepository.save({ wordId, bodyZones: ['whole'], intensity: 5 }, date)

describe('AvatarPage', () => {
  it('starts with a default character and stores nothing yet', async () => {
    await renderPage()
    expect(character().getAttribute('aria-label')).toBe('Your character, feeling light')
    expect(stored()).toBeNull()
  })

  it("takes its head from the latest check-in's feeling", async () => {
    await checkIn('sore', '2026-09-01')
    await new Promise((resolve) => setTimeout(resolve, 5))
    await checkIn('foggy', '2026-09-02')
    await renderPage()
    expect(character().getAttribute('aria-label')).toBe('Your character, feeling foggy')
    expect(stored()).toBeNull()
  })

  it('picking a feeling changes the head and is saved', async () => {
    const user = userEvent.setup()
    await renderPage()
    await user.click(screen.getByRole('button', { name: 'burning' }))
    expect(character().getAttribute('aria-label')).toBe('Your character, feeling burning')
    expect(screen.getByText('Feeling burning')).toBeTruthy()
    expect(stored().headWordId).toBe('burning')
  })

  it('offers the latest feeling as a shortcut only when it differs from the current head', async () => {
    const user = userEvent.setup()
    await checkIn('numb')
    await renderPage()
    expect(screen.queryByRole('button', { name: /Use my latest feeling/ })).toBeNull()

    await user.click(screen.getByRole('button', { name: 'tight' }))
    const shortcut = screen.getByRole('button', { name: 'Use my latest feeling: numb' })
    await user.click(shortcut)
    expect(character().getAttribute('aria-label')).toBe('Your character, feeling numb')
    expect(screen.queryByRole('button', { name: /Use my latest feeling/ })).toBeNull()
  })

  it('changes body, colour and face from their tabs', async () => {
    const user = userEvent.setup()
    await renderPage()

    await user.click(screen.getByRole('tab', { name: 'Body' }))
    await user.click(screen.getByRole('button', { name: 'Pear' }))
    await user.click(screen.getByRole('button', { name: 'Teal' }))
    expect(screen.getByRole('button', { name: 'Pear' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: 'Teal' }).getAttribute('aria-pressed')).toBe('true')

    await user.click(screen.getByRole('tab', { name: 'Face' }))
    await user.click(screen.getByRole('button', { name: 'Sleepy' }))

    expect(stored()).toMatchObject({ bodyId: 'pear', bodyColor: 'teal', faceId: 'sleepy' })
  })

  it('toggles accessories, with one hat at a time', async () => {
    const user = userEvent.setup()
    await renderPage()
    await user.click(screen.getByRole('tab', { name: 'Extras' }))

    await user.click(screen.getByRole('button', { name: 'Crown' }))
    await user.click(screen.getByRole('button', { name: 'Glasses' }))
    expect(character().getAttribute('aria-label')).toContain('wearing crown, glasses')

    await user.click(screen.getByRole('button', { name: 'Bow' }))
    expect(character().getAttribute('aria-label')).toContain('wearing glasses, bow')
    expect(screen.getByRole('button', { name: 'Crown' }).getAttribute('aria-pressed')).toBe('false')

    await user.click(screen.getByRole('button', { name: 'Glasses' }))
    expect(stored().accessoryIds).toEqual(['bow'])
  })

  it('keeps what was picked when the page is opened again', async () => {
    const user = userEvent.setup()
    const first = await renderPage()
    await user.click(screen.getByRole('button', { name: 'stabbing' }))
    await user.click(screen.getByRole('tab', { name: 'Extras' }))
    await user.click(screen.getByRole('button', { name: 'Scarf' }))
    first.unmount()

    // a newer check-in must not override the head the user chose
    await checkIn('hot')
    await renderPage()
    expect(character().getAttribute('aria-label')).toBe('Your character, feeling stabbing, wearing scarf')
  })

  it('resets the look but keeps the feeling', async () => {
    const user = userEvent.setup()
    await renderPage()
    await user.click(screen.getByRole('button', { name: 'dizzy' }))
    await user.click(screen.getByRole('tab', { name: 'Extras' }))
    await user.click(screen.getByRole('button', { name: 'Sparkles' }))
    await user.click(screen.getByRole('tab', { name: 'Face' }))
    await user.click(screen.getByRole('button', { name: 'Sad' }))

    await user.click(screen.getByRole('button', { name: 'Reset character' }))
    expect(character().getAttribute('aria-label')).toBe('Your character, feeling dizzy')
    expect(stored()).toMatchObject({ headWordId: 'dizzy', faceId: 'happy', accessoryIds: [] })
  })

  it('handles two quick edits in a row without losing the first', async () => {
    const user = userEvent.setup()
    await renderPage()
    await user.click(screen.getByRole('tab', { name: 'Extras' }))
    const scarf = screen.getByRole('button', { name: 'Scarf' })
    const hands = screen.getByRole('button', { name: 'Hands' })
    await user.click(scarf)
    await user.click(hands)
    await waitFor(() => expect(stored().accessoryIds).toEqual(['scarf', 'hands']))
  })

  it('exposes the customise tabs as an accessible tablist', async () => {
    await renderPage()
    const tabs = within(screen.getByRole('tablist')).getAllByRole('tab')
    expect(tabs.map((tab) => tab.textContent)).toEqual(['Feeling', 'Body', 'Face', 'Extras'])
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    expect(screen.getByRole('tabpanel').getAttribute('aria-labelledby')).toBe('avatar-tab-feeling')
  })
})
