import { userEvent } from '@testing-library/user-event'
import { createElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { wordCardsFor } from '@/i18n'
import { render, screen } from '@/test/render'
import BodyWordCards from './BodyWordCards'
import { gridWordsFor, pushOffset, type GridWord } from './wordGrid'

// counts how often each card's shape is rendered — it is drawn once per render of its card
const { shapeRenders } = vi.hoisted(() => ({ shapeRenders: new Map<string, number>() }))

vi.mock('@/entities/word', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/word')>()
  const CountingShape = (props: Parameters<typeof actual.WordShape>[0]) => {
    shapeRenders.set(props.card.id, (shapeRenders.get(props.card.id) ?? 0) + 1)
    return createElement(actual.WordShape, props)
  }
  return { ...actual, WordShape: CountingShape }
})

beforeAll(() => {
  Element.prototype.scrollTo = vi.fn()
})

beforeEach(() => shapeRenders.clear())

const cards = gridWordsFor(wordCardsFor('en'))
const byWord = (word: string) => cards.find((card) => card.word === word)!

/** Everything a card is drawn from: when this changes for a card, it has to be redrawn. */
const lookOf = (card: GridWord, selected: GridWord | null) => {
  const { x, y } = pushOffset(card, selected)
  return `${selected?.id === card.id}|${x}|${y}`
}

const snapshotRenders = () => new Map(shapeRenders)

describe('picking a word', () => {
  it('redraws only the cards that actually change, not the whole field', async () => {
    render(
      <MemoryRouter>
        <BodyWordCards />
      </MemoryRouter>,
    )
    expect(shapeRenders.size).toBe(cards.length)

    const picks = ['strong', 'light', 'burning'].map(byWord)
    let selected: GridWord | null = null
    for (const pick of picks) {
      const before = snapshotRenders()
      await userEvent.click(screen.getByRole('button', { name: pick.word }))

      for (const card of cards) {
        const changed = lookOf(card, selected) !== lookOf(card, pick)
        const extra = shapeRenders.get(card.id)! - before.get(card.id)!
        expect(extra, `${card.id} after picking ${pick.id}`).toBe(changed ? 1 : 0)
      }
      selected = pick
    }
  })

  it('leaves most of the field alone', async () => {
    render(
      <MemoryRouter>
        <BodyWordCards />
      </MemoryRouter>,
    )
    const before = snapshotRenders()

    await userEvent.click(screen.getByRole('button', { name: 'strong' }))

    const redrawn = cards.filter((card) => shapeRenders.get(card.id)! > before.get(card.id)!)
    expect(redrawn.length).toBeLessThan(cards.length / 2)
  })
})
