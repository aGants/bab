import { render, screen } from '@/test/render'
import { act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AvatarPage } from './AvatarPage'

const renderPage = () =>
  render(
    <MemoryRouter>
      <AvatarPage />
    </MemoryRouter>,
  )

const character = () => screen.getByRole('img', { name: /Your character/ })

describe('AvatarPage', () => {
  it('shows the title, the character and the customize button', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'What’s new?' })).toBeTruthy()
    expect(character().getAttribute('aria-label')).toBe('Your character')
    expect(screen.getByRole('button', { name: 'Customize' })).toBeTruthy()
  })

  it('shows the feeling from the last check-in as the head', () => {
    window.localStorage.setItem('world-head-word', 'sharp')
    renderPage()
    expect(character().getAttribute('aria-label')).toBe('Your character, feeling sharp')
  })

  it('has Avatar selected and Stickers dimmed because it is not built yet', () => {
    renderPage()
    expect(screen.getByRole('button', { name: 'Avatar' }).getAttribute('aria-pressed')).toBe('true')
    expect((screen.getByRole('button', { name: 'Stickers' }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('dims Necklace and Shoes because only hats exist so far', () => {
    renderPage()
    expect((screen.getByRole('button', { name: 'Hat' }) as HTMLButtonElement).disabled).toBe(false)
    expect((screen.getByRole('button', { name: 'Necklace' }) as HTMLButtonElement).disabled).toBe(true)
    expect((screen.getByRole('button', { name: 'Shoes' }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('offers every hat and starts with none on', () => {
    renderPage()
    for (const name of ['Bucket hat', 'Beanie', 'Cap', 'Beret', 'Wide-brim hat']) {
      expect(screen.getByRole('button', { name }).getAttribute('aria-pressed')).toBe('false')
    }
  })

  it('puts a picked hat on the character and takes it off when picked again', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Beanie' }))
    expect(screen.getByRole('button', { name: 'Beanie' }).getAttribute('aria-pressed')).toBe('true')
    expect(character().getAttribute('aria-label')).toBe('Your character, wearing a beanie')

    await user.click(screen.getByRole('button', { name: 'Beanie' }))
    expect(screen.getByRole('button', { name: 'Beanie' }).getAttribute('aria-pressed')).toBe('false')
    expect(character().getAttribute('aria-label')).toBe('Your character')
  })

  it('leaves the header mascot and storage alone until Customize is pressed', async () => {
    const user = userEvent.setup()
    const { container } = renderPage()
    const mascotHat = () => container.querySelector('.app-greeting-cloud g')

    await user.click(screen.getByRole('button', { name: 'Beret' }))
    // the big character shows it, nothing else does
    expect(character().getAttribute('aria-label')).toBe('Your character, wearing a beret')
    expect(mascotHat()).toBeNull()
    expect(window.localStorage.getItem('world-hat')).toBeNull()

    await user.click(screen.getByRole('button', { name: 'Customize' }))
    expect(mascotHat()).toBeTruthy()
    expect(window.localStorage.getItem('world-hat')).toBe('beret')
  })

  it('takes the hat off the header mascot when Customize is pressed with none picked', async () => {
    const user = userEvent.setup()
    window.localStorage.setItem('world-hat', 'cap')
    const { container } = renderPage()
    const mascotHat = () => container.querySelector('.app-greeting-cloud g')
    expect(mascotHat()).toBeTruthy()

    await user.click(screen.getByRole('button', { name: 'Cap' }))
    expect(mascotHat()).toBeTruthy()

    await user.click(screen.getByRole('button', { name: 'Customize' }))
    expect(mascotHat()).toBeNull()
    expect(window.localStorage.getItem('world-hat')).toBe('')
  })

  it('confirms the save on the button, and drops the confirmation when another hat is tried', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: 'Cap' }))
    await user.click(screen.getByRole('button', { name: 'Customize' }))
    expect(screen.getByRole('button', { name: 'Saved' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Customize' })).toBeNull()

    await user.click(screen.getByRole('button', { name: 'Beret' }))
    expect(screen.getByRole('button', { name: 'Customize' })).toBeTruthy()
  })

  it('goes back to Customize by itself after a moment', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    try {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      renderPage()
      await user.click(screen.getByRole('button', { name: 'Customize' }))
      expect(screen.getByRole('button', { name: 'Saved' })).toBeTruthy()
      await act(async () => {
        vi.advanceTimersByTime(2100)
      })
      expect(screen.getByRole('button', { name: 'Customize' })).toBeTruthy()
    } finally {
      vi.useRealTimers()
    }
  })

  it('swaps one hat for another', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: 'Cap' }))
    await user.click(screen.getByRole('button', { name: 'Beret' }))
    expect(screen.getByRole('button', { name: 'Cap' }).getAttribute('aria-pressed')).toBe('false')
    expect(character().getAttribute('aria-label')).toBe('Your character, wearing a beret')
  })

  it('keeps the hat after Customize, leaving and coming back', async () => {
    const user = userEvent.setup()
    const first = renderPage()
    await user.click(screen.getByRole('button', { name: 'Wide-brim hat' }))
    await user.click(screen.getByRole('button', { name: 'Customize' }))
    first.unmount()

    renderPage()
    expect(character().getAttribute('aria-label')).toBe('Your character, wearing a wide-brim hat')
  })

  it('drops a hat that was picked but never saved', async () => {
    const user = userEvent.setup()
    const first = renderPage()
    await user.click(screen.getByRole('button', { name: 'Wide-brim hat' }))
    first.unmount()

    renderPage()
    expect(character().getAttribute('aria-label')).toBe('Your character')
  })

  it('ignores a stored hat that no longer exists', () => {
    window.localStorage.setItem('world-hat', 'top-hat')
    renderPage()
    expect(character().getAttribute('aria-label')).toBe('Your character')
  })
})
