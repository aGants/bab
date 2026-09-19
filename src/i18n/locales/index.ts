import type { Messages } from '../types'
import { en } from './en'

/** Register a new language here: add `locales/<code>/` providing `Messages`. */
export const LOCALES = { en } satisfies Record<string, Messages>

export type Locale = keyof typeof LOCALES

export const DEFAULT_LOCALE: Locale = 'en'
