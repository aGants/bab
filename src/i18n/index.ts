/** All user-facing copy lives under this module (see ./locales), keyed by
 * language-neutral ids owned by the entities. Features import localized content
 * from here; entities never do. */
export {
  CATEGORIES,
  VAS_SCALE,
  WORD_CARDS,
  bodyZoneLabel,
  bodyZoneLabelFor,
  bodyZoneShortLabel,
  bodyZoneShortLabelFor,
  categoriesFor,
  vasScaleFor,
  wordCardsFor,
} from './content'
export { DEFAULT_LOCALE, LOCALES, type Locale } from './locales'
export type { BodyZoneText, Category, Messages, VasLevel, WordCard, WordText } from './types'
