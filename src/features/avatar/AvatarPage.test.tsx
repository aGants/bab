import { render, screen } from '@/test/render'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AvatarPage } from './AvatarPage'

const renderPage = () =>
  render(
    <MemoryRouter>
      <AvatarPage />
    </MemoryRouter>,
  )

describe('AvatarPage', () => {
  it('shows the title, the character and the customize button', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'What’s new?' })).toBeTruthy()
    expect(screen.getByRole('img', { name: 'Your character' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Customize' })).toBeTruthy()
  })

  it('has Avatar selected and Stickers not available yet', () => {
    renderPage()
    expect(screen.getByRole('button', { name: 'Avatar' }).getAttribute('aria-pressed')).toBe('true')
    expect((screen.getByRole('button', { name: 'Stickers' }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('shows the accessory picker image', () => {
    renderPage()
    expect(screen.getByRole('img', { name: 'Accessories: hats, necklaces and shoes' })).toBeTruthy()
  })

  it('marks World as the current tab', () => {
    renderPage()
    expect(screen.getByRole('link', { name: 'World' })).toBeTruthy()
  })
})
