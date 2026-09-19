import type { BodyZone, CheckInIntensity } from '@/entities/check-in/types'
import { CATEGORY_STYLES, WORDS, type CategoryId } from '@/entities/word'
import { DEFAULT_LOCALE, LOCALES, type Locale } from './locales'
import type { Category, VasLevel, WordCard } from './types'

export const categoriesFor = (locale: Locale): Record<CategoryId, Category> => {
  const labels = LOCALES[locale].categories
  return Object.fromEntries(
    (Object.keys(CATEGORY_STYLES) as CategoryId[]).map((id) => [
      id,
      { id, ...CATEGORY_STYLES[id], label: labels[id] },
    ]),
  ) as Record<CategoryId, Category>
}

export const wordCardsFor = (locale: Locale): WordCard[] =>
  WORDS.map((word) => ({ ...word, ...LOCALES[locale].words[word.id] }))

export const vasScaleFor = (locale: Locale): Record<CheckInIntensity, VasLevel> =>
  LOCALES[locale].vas

export const bodyZoneLabelFor = (locale: Locale, zone: BodyZone): string =>
  LOCALES[locale].bodyZones[zone].phrase

export const bodyZoneShortLabelFor = (locale: Locale, zone: BodyZone): string =>
  LOCALES[locale].bodyZones[zone].short

// Default-language shortcuts for code that isn't (yet) locale-aware. Once the app
// has a language setting, callers should switch to the `*For(locale)` forms.
export const CATEGORIES = categoriesFor(DEFAULT_LOCALE)
export const WORD_CARDS = wordCardsFor(DEFAULT_LOCALE)
export const VAS_SCALE = vasScaleFor(DEFAULT_LOCALE)
export const bodyZoneLabel = (zone: BodyZone): string => bodyZoneLabelFor(DEFAULT_LOCALE, zone)
export const bodyZoneShortLabel = (zone: BodyZone): string =>
  bodyZoneShortLabelFor(DEFAULT_LOCALE, zone)
