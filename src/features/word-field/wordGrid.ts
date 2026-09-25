import type { WordCard } from '@/i18n'

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

/** Places the given cards on the grid. Positions depend only on the word ids, so the
 * layout is the same in every language — only the text on the cards changes. */
export const gridWordsFor = (cards: readonly WordCard[]): GridWord[] =>
  [...cards]
    .sort((a, b) => featuredRank(a.id) - featuredRank(b.id))
    .map((card, i) => ({
      ...card,
      col: i % GRID_COLS,
      row: Math.floor(i / GRID_COLS),
    }))

/** How many grid steps out a neighbour still gets pushed, and how far (in px)
 * the closest ones move — tapers to 0 at PUSH_RADIUS, so only cards actually
 * next to the selected one make room for it; the rest of the field stays put. */
export const PUSH_RADIUS = 2
export const PUSH_STRENGTH = 26

/** How far (px) a card moves away from the picked one to make room for it. No move at all
 * (zero on both axes) when nothing is picked, for the picked card itself and for cards out of reach. */
export const pushOffset = (
  card: Pick<GridWord, 'col' | 'row'>,
  selected: Pick<GridWord, 'col' | 'row'> | null,
): { x: number; y: number } => {
  if (!selected) return { x: 0, y: 0 }
  const dCol = card.col - selected.col
  const dRow = card.row - selected.row
  const dist = Math.hypot(dCol, dRow)
  // at PUSH_RADIUS the push has tapered to nothing, which is the same as out of reach (and this keeps a -0 out of the result)
  if (dist === 0 || dist >= PUSH_RADIUS) return { x: 0, y: 0 }
  const magnitude = PUSH_STRENGTH * (1 - dist / PUSH_RADIUS)
  return { x: (dCol / dist) * magnitude, y: (dRow / dist) * magnitude }
}
