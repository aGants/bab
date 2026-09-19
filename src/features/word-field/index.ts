/** Public surface of the word-field feature — other features import from here
 * instead of reaching into its files. The screen itself (BodyWordCards) is
 * deliberately not exported: the router lazy-loads it by path. */
export { CATEGORIES, WORD_CARDS } from './bodyWordsData'
export type { WordCard } from './bodyWordsData'
export { WordShape } from './WordShape'
export { wordColor, wordLabelColor, wordPath } from './helpers/shapes'
