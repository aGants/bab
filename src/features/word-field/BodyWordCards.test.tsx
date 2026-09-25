import { userEvent } from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@/test/render'
import BodyWordCards from './BodyWordCards'

// jsdom doesn't implement scrolling; the screen scrolls the picked card into view
beforeAll(() => {
  Element.prototype.scrollTo = vi.fn()
})

const renderScreen = () =>
  render(
    <MemoryRouter>
      <BodyWordCards />
    </MemoryRouter>,
  )

/** The card for a word — its name is the word itself. */
const card = (word: string) => screen.getByRole('button', { name: word })

/** How far a card is pushed, in px; a card that isn't moved has no offset either way it's written. */
const shift = (word: string) => {
  const [x = 0, y = 0] = (card(word).style.transform.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }
}
const still = { x: 0, y: 0 }

describe('BodyWordCards', () => {
  it('lists every word as an unselected card', () => {
    renderScreen()

    expect(screen.getAllByRole('button', { pressed: false }).length).toBeGreaterThanOrEqual(24)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('opens the details of the picked word and links on to its check-in', async () => {
    renderScreen()

    await userEvent.click(card('strong'))

    const details = screen.getByRole('dialog', { name: 'strong' })
    expect(card('strong').getAttribute('aria-pressed')).toBe('true')
    expect(within(details).getByRole('link', { name: 'Continue' }).getAttribute('href')).toBe('/words/strong/check-in')
  })

  it('makes room for the picked card by pushing its near neighbours away', async () => {
    renderScreen()

    await userEvent.click(card('strong')) // top-left corner of the grid

    expect(shift('light')).toEqual({ x: 13, y: 0 }) // one step right
    expect(shift('tight')).toEqual({ x: 0, y: 13 }) // one step down
    expect(shift('achy')).toEqual({ x: 5.4, y: 5.4 }) // diagonal, a little less far
    expect(shift('sore')).toEqual(still) // two steps away: out of reach
    expect(shift('strong')).toEqual(still) // the picked card itself stays put
    expect(shift('sharp')).toEqual(still) // far away
  })

  it('moves the gap when another word is picked', async () => {
    renderScreen()

    await userEvent.click(card('strong'))
    await userEvent.click(card('light'))

    expect(card('strong').getAttribute('aria-pressed')).toBe('false')
    expect(card('light').getAttribute('aria-pressed')).toBe('true')
    expect(shift('strong')).toEqual({ x: -13, y: 0 }) // now to the left of the picked card
    expect(shift('sore')).toEqual({ x: 13, y: 0 })
    expect(shift('light')).toEqual(still)
  })

  it('puts everything back when the details are closed', async () => {
    renderScreen()
    await userEvent.click(card('strong'))

    await userEvent.click(screen.getByRole('button', { name: 'Close detail' }))

    expect(screen.queryByRole('dialog')).toBeNull()
    expect(card('strong').getAttribute('aria-pressed')).toBe('false')
    expect(shift('light')).toEqual(still)
  })
})
