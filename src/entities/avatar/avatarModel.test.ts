import { describe, expect, it } from 'vitest'
import { defaultAvatar, parseAvatar, toggleAccessory } from './avatarModel'

describe('toggleAccessory', () => {
  it('puts an accessory on and takes it off again', () => {
    const worn = toggleAccessory(defaultAvatar('sore'), 'glasses')
    expect(worn.accessoryIds).toEqual(['glasses'])
    expect(toggleAccessory(worn, 'glasses').accessoryIds).toEqual([])
  })

  it('replaces whatever is in the same slot', () => {
    let avatar = toggleAccessory(defaultAvatar('sore'), 'crown')
    avatar = toggleAccessory(avatar, 'bow')
    expect(avatar.accessoryIds).toEqual(['bow'])
  })

  it('keeps accessories from other slots', () => {
    let avatar = toggleAccessory(defaultAvatar('sore'), 'crown')
    avatar = toggleAccessory(avatar, 'glasses')
    avatar = toggleAccessory(avatar, 'flower')
    expect(avatar.accessoryIds).toEqual(['glasses', 'flower'])
  })

  it('does not mutate its input', () => {
    const before = defaultAvatar('sore')
    toggleAccessory(before, 'scarf')
    expect(before.accessoryIds).toEqual([])
  })
})

describe('parseAvatar', () => {
  it.each([null, undefined, 'x', 42, [], {}, { headWordId: '' }, { headWordId: 7 }])(
    'returns null for unusable data (%j)',
    (raw) => {
      expect(parseAvatar(raw)).toBeNull()
    },
  )

  it('round-trips a valid avatar', () => {
    const avatar = toggleAccessory(
      { ...defaultAvatar('foggy'), bodyId: 'pear' as const, bodyColor: 'teal' as const, faceId: 'sleepy' as const },
      'blush',
    )
    expect(parseAvatar(JSON.parse(JSON.stringify(avatar)))).toEqual(avatar)
  })

  it('falls back to defaults field by field', () => {
    const parsed = parseAvatar({ headWordId: 'hot', bodyId: 'gone', bodyColor: 5, faceId: 'happy' })
    expect(parsed).toEqual({ ...defaultAvatar('hot'), faceId: 'happy' })
  })

  it('drops unknown, duplicate and slot-conflicting accessories', () => {
    const parsed = parseAvatar({
      headWordId: 'hot',
      accessoryIds: ['glasses', 'glasses', 'nope', 42, 'crown', 'bow'],
    })
    expect(parsed?.accessoryIds).toEqual(['glasses', 'bow'])
  })

  it('tolerates accessoryIds that is not an array', () => {
    expect(parseAvatar({ headWordId: 'hot', accessoryIds: 'crown' })?.accessoryIds).toEqual([])
  })
})
