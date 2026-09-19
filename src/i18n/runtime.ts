import { i18n, type Messages } from '@lingui/core'
import { safeStorage } from '@/shared/lib/safeStorage'
import { DEFAULT_LOCALE, LOCALES, type Locale } from './locales'

const STORAGE_KEY = 'locale'

const isLocale = (value: string | null | undefined): value is Locale =>
  value != null && Object.hasOwn(LOCALES, value)

/** The language the app opens in: the one chosen in settings, else the browser's, else the default. */
export const getInitialLocale = (): Locale => {
  const stored = safeStorage.getItem(STORAGE_KEY)
  if (isLocale(stored)) return stored
  const preferred = navigator.languages
    ?.map((tag) => tag.split('-')[0])
    .find((code): code is Locale => isLocale(code))
  return preferred ?? DEFAULT_LOCALE
}

/** Loads a language's UI catalog and makes it the active one. Catalogs are separate
 * chunks, so a language is only downloaded when it is actually used. */
export const activateLocale = async (locale: Locale): Promise<void> => {
  const { messages }: { messages: Messages } = await import(`./locales/${locale}/messages.po`)
  i18n.load(locale, messages)
  i18n.activate(locale)
  document.documentElement.lang = locale
}

/** Switches the app language and remembers the choice for next launch. */
export const setLocale = async (locale: Locale): Promise<void> => {
  await activateLocale(locale)
  safeStorage.setItem(STORAGE_KEY, locale)
}
