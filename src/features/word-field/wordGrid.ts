import { WORD_CARDS, type WordCard } from '@/i18n'

/** A word placed on the pannable word-cloud grid. Position is purely a layout
 * concern of this screen, so it lives here rather than on the word itself. */
export type GridWord = WordCard & { col: number; row: number }

// Lay every word out on one flat, continuous field — no quadrants — in a fixed
// number of columns, filling row by row in the order the words are listed.
export const GRID_COLS = 4

export const GRID_WORDS: GridWord[] = WORD_CARDS.map((card, i) => ({
  ...card,
  col: i % GRID_COLS,
  row: Math.floor(i / GRID_COLS),
}))
