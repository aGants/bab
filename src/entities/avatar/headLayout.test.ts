import { describe, expect, it } from 'vitest'
import { WORDS, wordPath } from '@/entities/word'
import { wordHeadLayout } from './headLayout'

describe('wordHeadLayout', () => {
  it('places every word the same way it always has', () => {
    // locks the fitting maths: the character's head, face and hat sit where the design put them
    expect(Object.fromEntries(WORDS.map((word) => [word.id, wordHeadLayout(word.id)]))).toMatchSnapshot()
  })

  it('draws the head from the word\'s full (not calm) shape', () => {
    for (const word of WORDS) expect(wordHeadLayout(word.id).path).toBe(wordPath(word.id, false))
  })

  it('works a word out once and hands the same layout back afterwards', () => {
    for (const word of WORDS) expect(wordHeadLayout(word.id)).toBe(wordHeadLayout(word.id))
  })
})
