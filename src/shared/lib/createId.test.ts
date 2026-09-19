import { afterEach, describe, expect, it, vi } from 'vitest'
import { createId } from './createId'

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

describe('createId', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns a v4 uuid', () => {
    expect(createId()).toMatch(UUID_V4)
  })

  it('still returns a v4 uuid when crypto.randomUUID is unavailable (insecure context)', () => {
    vi.stubGlobal('crypto', { getRandomValues: crypto.getRandomValues.bind(crypto) })
    const ids = new Set([createId(), createId(), createId()])
    expect(ids.size).toBe(3)
    ids.forEach((id) => expect(id).toMatch(UUID_V4))
  })
})
