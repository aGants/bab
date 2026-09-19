import { i18n, type Messages } from '@lingui/core'
import { safeStorage } from '@/shared/lib/safeStorage'
import { DEFAULT_LOCALE, isLocale, type Locale } from './locales'

const STORAGE_KEY = 'locale'

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

/** Switches the app language and remembers the choice for next launch. If the catalog
 * can't be loaded (offline, and this language was never fetched) it throws before
 * anything changes, so the current language stays active. */
export const setLocale = async (locale: Locale): Promise<void> => {
  await activateLocale(locale)
  safeStorage.setItem(STORAGE_KEY, locale)
}
