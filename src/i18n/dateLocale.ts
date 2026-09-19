import type { Locale as DateFnsLocale } from 'date-fns'
import { enUS } from 'date-fns/locale/en-US'
import { it as itIT } from 'date-fns/locale/it'
import type { Locale } from './locales'

/** date-fns locale per app language — react-day-picker takes it for month and weekday names. */
export const DATE_FNS_LOCALES: Record<Locale, DateFnsLocale> = {
  en: enUS,
  it: itIT,
}
