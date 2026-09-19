import { describe, expect, it } from 'vitest'
import { WORDS } from '@/entities/word'
import { HEAD_CENTER, headTopY } from './headGeometry'

describe('headTopY', () => {
  it.each(WORDS.map((word) => word.id))('sits above the head centre and inside the canvas for %s', (id) => {
    const top = headTopY(id)
    expect(top).toBeGreaterThan(0)
    expect(top).toBeLessThan(HEAD_CENTER.y)
  })

  it('differs between a tall shape and a squat one', () => {
    // "tight" is a wide, short band; "sharp" reaches much higher
    expect(headTopY('tight')).toBeGreaterThan(headTopY('sharp'))
  })
})
