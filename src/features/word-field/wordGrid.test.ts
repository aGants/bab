import { describe, expect, it } from 'vitest'
import { wordCardsFor } from '@/i18n'
import { GRID_COLS, gridWordsFor } from './wordGrid'

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
