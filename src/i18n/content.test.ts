import { describe, expect, it } from 'vitest'
import { WORDS } from '@/entities/word'
import { bodyZoneLabel, bodyZoneShortLabel, categoriesFor, wordCardsFor, WORD_CARDS } from './content'
import { LOCALES, type Locale } from './locales'

const locales = Object.keys(LOCALES) as Locale[]
const nonEmpty = (text: string) => text.trim() !== ''

describe('word definitions', () => {
  it('has unique ids', () => {
    expect(new Set(WORDS.map((word) => word.id)).size).toBe(WORDS.length)
  })
})

describe.each(locales)('locale "%s"', (locale) => {
  const messages = LOCALES[locale]

  it('has non-empty copy for every word', () => {
    for (const card of wordCardsFor(locale)) {
      for (const key of ['word', 'tagline', 'metaphor', 'description', 'feelsLike', 'recommendation'] as const) {
        expect(nonEmpty(card[key]), `${card.id}.${key}`).toBe(true)
      }
    }
  })

  it('has no copy for words that no longer exist', () => {
    const ids = new Set<string>(WORDS.map((word) => word.id))
    for (const id of Object.keys(messages.words)) expect(ids.has(id), id).toBe(true)
  })

  it('has a label for every category', () => {
    for (const category of Object.values(categoriesFor(locale))) {
      expect(nonEmpty(category.label), category.id).toBe(true)
    }
  })

  it('describes every pain scale level, 0 through 10', () => {
    expect(Object.keys(messages.vas)).toHaveLength(11)
    for (const [level, text] of Object.entries(messages.vas)) {
      expect(nonEmpty(text.label) && nonEmpty(text.description), `level ${level}`).toBe(true)
    }
  })

  it('names every body zone in both forms', () => {
    for (const [zone, text] of Object.entries(messages.bodyZones)) {
      expect(nonEmpty(text.phrase) && nonEmpty(text.short), zone).toBe(true)
    }
  })
})

describe('default-language shortcuts', () => {
  it('list every word in the same order as the definitions', () => {
    expect(WORD_CARDS.map((card) => card.id)).toEqual(WORDS.map((word) => word.id))
  })

  it('keep the English body-zone phrasing the summary and calendar rely on', () => {
    expect(bodyZoneLabel('shoulderLeft')).toBe('your left shoulder')
    expect(bodyZoneLabel('upperBackRight')).toBe('your right upper back')
    expect(bodyZoneLabel('whole')).toBe('all over')
    expect(bodyZoneShortLabel('kneeRight')).toBe('right knee')
    expect(bodyZoneShortLabel('whole')).toBe('all over')
  })
})
