import { describe, expect, it } from 'vitest'
import { wordCardsFor } from '@/i18n'
import { GRID_COLS, PUSH_RADIUS, PUSH_STRENGTH, gridWordsFor, pushOffset } from './wordGrid'

const layout = (locale: 'en' | 'it') =>
  gridWordsFor(wordCardsFor(locale)).map(({ id, col, row }) => ({ id, col, row }))

describe('gridWordsFor', () => {
  it('puts the same word in the same place in every language', () => {
    expect(layout('it')).toEqual(layout('en'))
  })

  it('fills the grid row by row, featured words first', () => {
    const [first, second, third, fourth] = layout('en')
    expect([first.id, second.id, third.id]).toEqual(['strong', 'light', 'sore'])
    expect([third.row, fourth.row, fourth.col]).toEqual([0, 1, 0])
    expect(GRID_COLS).toBe(3)
  })

  it('carries each language’s own text on the cards', () => {
    expect(gridWordsFor(wordCardsFor('it'))[0].word).toBe('forte')
  })
})

describe('pushOffset', () => {
  const selected = { col: 1, row: 1 }

  it('does not move anything while nothing is picked', () => {
    expect(pushOffset({ col: 0, row: 0 }, null)).toEqual({ x: 0, y: 0 })
  })

  it('does not move the picked card itself', () => {
    expect(pushOffset(selected, selected)).toEqual({ x: 0, y: 0 })
  })

  it('pushes a card next to the picked one straight away from it', () => {
    expect(pushOffset({ col: 2, row: 1 }, selected)).toEqual({ x: PUSH_STRENGTH / 2, y: 0 })
    expect(pushOffset({ col: 0, row: 1 }, selected)).toEqual({ x: -PUSH_STRENGTH / 2, y: 0 })
    expect(pushOffset({ col: 1, row: 0 }, selected)).toEqual({ x: 0, y: -PUSH_STRENGTH / 2 })
    expect(pushOffset({ col: 1, row: 2 }, selected)).toEqual({ x: 0, y: PUSH_STRENGTH / 2 })
  })

  it('pushes diagonal neighbours less far, still directly away', () => {
    const { x, y } = pushOffset({ col: 2, row: 2 }, selected)
    expect(x).toBeCloseTo(y)
    expect(x).toBeGreaterThan(0)
    expect(Math.hypot(x, y)).toBeCloseTo(PUSH_STRENGTH * (1 - Math.SQRT2 / PUSH_RADIUS))
  })

  it('leaves cards at the edge of reach, and beyond, where they are', () => {
    expect(pushOffset({ col: 3, row: 1 }, selected)).toEqual({ x: 0, y: 0 })
    expect(pushOffset({ col: 4, row: 4 }, selected)).toEqual({ x: 0, y: 0 })
  })

  it('reports a plain zero, never negative zero, for a card that stays put', () => {
    // `memo` compares props with Object.is, which tells -0 from 0: a -0 would redraw a card that hasn't moved
    for (const card of [{ col: 1, row: -1 }, { col: -1, row: 1 }, { col: 3, row: 1 }, { col: 1, row: 3 }]) {
      const { x, y } = pushOffset(card, selected)
      expect(Object.is(x, 0) && Object.is(y, 0), `${card.col},${card.row}`).toBe(true)
    }
  })
})
