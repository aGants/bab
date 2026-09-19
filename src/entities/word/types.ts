import type { ColorToken } from '@/styles/tokens'

export type CategoryId = 'muscle' | 'pain' | 'cycle' | 'energy'

/** 🟢 normal — 🟡 monitor / pay attention — 🔴 stop / seek support */
export type Signal = 'green' | 'yellow' | 'red'

/** Everything about a word that doesn't depend on the reader's language. Its
 * user-facing copy lives in src/i18n, keyed by `id`. */
export interface WordDefinition {
  id: string
  category: CategoryId
  /** 0 = mild/blunt, 1 = medium, 2 = intense/sharp — shapes get more extreme with this */
  intensity: 0 | 1 | 2
  /** how urgently this sensation should be treated, shown on the check-in summary */
  signal: Signal
}

export interface CategoryStyle {
  emoji: string
  /** design-token color (see src/styles/tokens.css) this category's shapes are drawn in */
  color: ColorToken
}
