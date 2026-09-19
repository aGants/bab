import type { Messages } from '../types'
import { en } from './en'
import { it } from './it'

/** Register a new language here: add `locales/<code>/` providing `Messages`,
 * its name in `LOCALE_NAMES`, and its date-fns locale in `../dateLocale.ts`. */
export const LOCALES = { en, it } satisfies Record<string, Messages>

export type Locale = keyof typeof LOCALES

export const DEFAULT_LOCALE: Locale = 'en'

/** Switch for everything that lets a user end up in a language other than English: the
 * picker in Settings and picking the language up from the browser. Off until a second
 * language is ready to ship, so everyone keeps getting English. To try another language
 * meanwhile, run `localStorage.setItem('locale', 'it')` in the browser console. */
export const LANGUAGE_SELECTION_ENABLED = true

/** Each language's own name, as shown in the language picker. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  it: 'Italiano',
}

export const isLocale = (value: string | null | undefined): value is Locale =>
  value != null && Object.hasOwn(LOCALES, value)
