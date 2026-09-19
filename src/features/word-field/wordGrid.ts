import { WORD_CARDS, type WordCard } from '@/i18n'

/** A word placed on the pannable word-cloud grid. Position is purely a layout
 * concern of this screen, so it lives here rather than on the word itself. */
export type GridWord = WordCard & { col: number; row: number }

// Lay every word out on one flat, continuous field — no quadrants — in a fixed
// number of columns, filling row by row in the order the words are listed.
export const GRID_COLS = 3

/** The words the design shows first, in its order; every other word follows in
 * the order the word list gives them. */
const FEATURED_ORDER: readonly string[] = [
  'strong', 'light', 'sore',
  'tight', 'achy', 'unstable',
  'stiff', 'crampy', 'gripping',
  'sharp', 'stabbing', 'numb',
  'burning', 'tingling', 'bloated',
]

const featuredRank = (id: string): number => {
  const rank = FEATURED_ORDER.indexOf(id)
  return rank === -1 ? FEATURED_ORDER.length : rank
}

const ORDERED_WORDS = [...WORD_CARDS].sort((a, b) => featuredRank(a.id) - featuredRank(b.id))

export const GRID_WORDS: GridWord[] = ORDERED_WORDS.map((card, i) => ({
  ...card,
  col: i % GRID_COLS,
  row: Math.floor(i / GRID_COLS),
}))
