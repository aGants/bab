import { wordPath } from '@/features/word-field'

/** Where the head sits inside the character's 200×260 canvas. Word shapes are
 * drawn in a 100×100 box around (50, 50), so this scale/centre maps them over. */
export const HEAD_CENTER = { x: 100, y: 78 } as const
export const HEAD_SCALE = 1.16

export const headTransform = `translate(${HEAD_CENTER.x - 50 * HEAD_SCALE} ${HEAD_CENTER.y - 50 * HEAD_SCALE}) scale(${HEAD_SCALE})`

/** Canvas y of the highest point of a word's head — hats sit on this, since a
 * spiky or squat shape doesn't reach the same height as a round one. Read from
 * the path's own points (curve control points overshoot slightly, which just
 * tucks the hat a touch into the head). */
export const headTopY = (wordId: string): number => {
  const numbers = wordPath(wordId, false).match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? []
  let minY = 50
  // every command in these paths (M, L, Q) is made of x y pairs
  for (let i = 1; i < numbers.length; i += 2) minY = Math.min(minY, numbers[i])
  return HEAD_CENTER.y + (minY - 50) * HEAD_SCALE
}
