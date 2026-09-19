import type { BodyZone, CheckInIntensity } from '@/entities/check-in/types'
import type { CategoryId, CategoryStyle, WordDefinition, WordId } from '@/entities/word'

/** The translatable copy for one word. */
export interface WordText {
  word: string
  /** standalone cue ("Notice how springy") without its own end punctuation */
  tagline: string
  metaphor: string
  description: string
  feelsLike: string
  /** short, practical advice shown right after a check-in for this word */
  recommendation: string
}

/** A word as the UI consumes it: its language-neutral definition plus copy in one language. */
export type WordCard = WordDefinition & WordText

export interface Category extends CategoryStyle {
  id: CategoryId
  label: string
}

/** One level of the plain-language pain (VAS) scale. */
export interface VasLevel {
  label: string
  description: string
}

export interface BodyZoneText {
  /** reads inside a sentence, e.g. "your left knee" */
  phrase: string
  /** compact form for lists, e.g. "left knee" */
  short: string
}

/** Everything one language has to provide. Every domain is an exhaustive `Record`,
 * so a missing translation is a compile error rather than a runtime gap. */
export interface Messages {
  words: Record<WordId, WordText>
  categories: Record<CategoryId, string>
  vas: Record<CheckInIntensity, VasLevel>
  bodyZones: Record<BodyZone, BodyZoneText>
}
