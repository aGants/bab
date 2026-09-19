import type { WordDefinition } from './types'

/** Language-neutral word definitions, in display order. All user-facing copy for
 * these lives in src/i18n, keyed by `id`; ids are also what check-ins and the avatar persist, so they must never be translated. */
export const WORDS = [
  // Muscle signals
  { id: 'strong', category: 'muscle', intensity: 1, signal: 'green' },
  { id: 'light', category: 'muscle', intensity: 0, signal: 'green' },
  { id: 'sore', category: 'muscle', intensity: 1, signal: 'green' },
  { id: 'achy', category: 'muscle', intensity: 1, signal: 'green' },
  { id: 'tight', category: 'muscle', intensity: 2, signal: 'green' },
  { id: 'stiff', category: 'muscle', intensity: 1, signal: 'green' },
  { id: 'unstable', category: 'muscle', intensity: 2, signal: 'yellow' },
  // Pain types
  { id: 'crampy', category: 'pain', intensity: 1, signal: 'yellow' },
  { id: 'gripping', category: 'pain', intensity: 2, signal: 'yellow' },
  { id: 'sharp', category: 'pain', intensity: 2, signal: 'red' },
  { id: 'stabbing', category: 'pain', intensity: 2, signal: 'red' },
  { id: 'burning', category: 'pain', intensity: 1, signal: 'green' },
  { id: 'tingling', category: 'pain', intensity: 1, signal: 'yellow' },
  { id: 'numb', category: 'pain', intensity: 0, signal: 'red' },
  // Cycle & hormones
  { id: 'bloated', category: 'cycle', intensity: 1, signal: 'green' },
  { id: 'tender', category: 'cycle', intensity: 1, signal: 'green' },
  { id: 'nauseous', category: 'cycle', intensity: 1, signal: 'yellow' },
  { id: 'swollen', category: 'cycle', intensity: 2, signal: 'green' },
  { id: 'hot', category: 'cycle', intensity: 1, signal: 'green' },
  // Energy & fuel
  { id: 'heavy', category: 'energy', intensity: 2, signal: 'green' },
  { id: 'dizzy', category: 'energy', intensity: 2, signal: 'yellow' },
  { id: 'headachy', category: 'energy', intensity: 1, signal: 'green' },
  { id: 'foggy', category: 'energy', intensity: 0, signal: 'yellow' },
  { id: 'shaky', category: 'energy', intensity: 2, signal: 'yellow' },
] as const satisfies readonly WordDefinition[]

export type WordId = (typeof WORDS)[number]['id']
