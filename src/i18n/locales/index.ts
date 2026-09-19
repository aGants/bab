import type { Messages } from '../types'
import { en } from './en'
import { it } from './it'

/** Register a new language here: add `locales/<code>/` providing `Messages`,
 * its name in `LOCALE_NAMES`, and its date-fns locale in `../dateLocale.ts`. */
export const LOCALES = { en, it } satisfies Record<string, Messages>

export type Locale = keyof typeof LOCALES

export const DEFAULT_LOCALE: Locale = 'en'

/** Each language's own name, as shown in the language picker. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  it: 'Italiano',
}

export const isLocale = (value: string | null | undefined): value is Locale =>
  value != null && Object.hasOwn(LOCALES, value)
