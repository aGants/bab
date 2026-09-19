import { useLingui } from '@lingui/react'
import { useMemo } from 'react'
import {
  bodyZoneLabelFor,
  bodyZoneShortLabelFor,
  categoriesFor,
  errorScreenFor,
  vasScaleFor,
  wordCardsFor,
} from './content'
import { DATE_FNS_LOCALES } from './dateLocale'
import { DEFAULT_LOCALE, isLocale, type Locale } from './locales'
import type { BodyZone } from '@/entities/check-in/types'

/** The language the UI is showing right now. Re-renders the caller when it changes. */
export const useLocale = (): Locale => {
  const { i18n } = useLingui()
  return isLocale(i18n.locale) ? i18n.locale : DEFAULT_LOCALE
}

/** Domain copy (words, pain scale, body zones, error screen) in the current language.
 * UI strings go through Lingui instead; this covers the structured content that
 * lives in the typed catalogs under src/i18n/locales. */
export const useContent = () => {
  const locale = useLocale()
  return useMemo(
    () => ({
      locale,
      dateLocale: DATE_FNS_LOCALES[locale],
      wordCards: wordCardsFor(locale),
      categories: categoriesFor(locale),
      vasScale: vasScaleFor(locale),
      errorScreen: errorScreenFor(locale),
      bodyZoneLabel: (zone: BodyZone) => bodyZoneLabelFor(locale, zone),
      bodyZoneShortLabel: (zone: BodyZone) => bodyZoneShortLabelFor(locale, zone),
    }),
    [locale],
  )
}
