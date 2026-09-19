import type { BodyZone, CheckInIntensity } from '@/entities/check-in/types'
import { CATEGORY_STYLES, WORDS, type CategoryId } from '@/entities/word'
import { LOCALES, type Locale } from './locales'
import type { Category, ErrorScreenText, VasLevel, WordCard } from './types'

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

export const errorScreenFor = (locale: Locale): ErrorScreenText => LOCALES[locale].errorScreen

export const bodyZoneLabelFor = (locale: Locale, zone: BodyZone): string =>
  LOCALES[locale].bodyZones[zone].phrase

export const bodyZoneShortLabelFor = (locale: Locale, zone: BodyZone): string =>
  LOCALES[locale].bodyZones[zone].short
