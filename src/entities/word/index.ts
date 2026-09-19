/** Public surface of the word domain: language-neutral word definitions and the
 * shape drawing. Localized copy (names, descriptions, …) lives in src/i18n. */
export { WORDS, type WordId } from './words'
export { CATEGORY_STYLES } from './categories'
export type { CategoryId, CategoryStyle, Signal, WordDefinition } from './types'
export { WordShape } from './WordShape'
export { wordColor, wordLabelColor, wordPath } from './shapes'
