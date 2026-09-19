/** All user-facing copy lives under this module (see ./locales), keyed by
 * language-neutral ids owned by the entities. Features import localized content
 * from here; entities never do. UI strings go through Lingui (`t`, `<Trans>`);
 * structured content is read with `useContent()`. */
export {
  bodyZoneLabelFor,
  bodyZoneShortLabelFor,
  categoriesFor,
  errorScreenFor,
  vasScaleFor,
  wordCardsFor,
} from './content'
export { DATE_FNS_LOCALES } from './dateLocale'
export { DEFAULT_LOCALE, LOCALES, LOCALE_NAMES, isLocale, type Locale } from './locales'
export type { BodyZoneText, Category, ErrorScreenText, Messages, VasLevel, WordCard, WordText } from './types'
export { useContent, useLocale } from './useContent'
