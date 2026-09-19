import { render } from '@/test/render'
import { describe, expect, it } from 'vitest'
import { WORDS } from '@/entities/word'
import { defaultAvatar } from '@/entities/avatar/avatarModel'
import { ACCESSORY_IDS, BODY_COLOR_IDS, BODY_IDS, FACE_IDS } from '@/entities/avatar/types'
import { AvatarCharacter } from './AvatarCharacter'

const label = (container: HTMLElement) => container.querySelector('svg')?.getAttribute('aria-label')

describe('AvatarCharacter', () => {
  it.each(WORDS.map((word) => word.id))('draws the %s head', (id) => {
    const { container } = render(<AvatarCharacter config={defaultAvatar(id)} />)
    expect(label(container)).toBe(`Your character, feeling ${id}`)
    expect(container.querySelectorAll('path').length).toBeGreaterThan(1)
  })

  it('renders every body, colour, face and accessory', () => {
    for (const bodyId of BODY_IDS) {
      for (const bodyColor of BODY_COLOR_IDS) {
        for (const faceId of FACE_IDS) {
          const config = { ...defaultAvatar('sore'), bodyId, bodyColor, faceId, accessoryIds: [] }
          expect(() => render(<AvatarCharacter config={config} />)).not.toThrow()
        }
      }
    }
    // one of each slot at once, hats being the only slot with several options
    const config = { ...defaultAvatar('sore'), accessoryIds: [...ACCESSORY_IDS] }
    const { container } = render(<AvatarCharacter config={config} />)
    expect(label(container)).toContain('wearing crown, bow, flower, glasses')
  })

  it('draws the head over the accessories that sit behind it', () => {
    const config = { ...defaultAvatar('sore'), accessoryIds: ['scarf' as const, 'glasses' as const] }
    const { container } = render(<AvatarCharacter config={config} />)
    const group = container.querySelector('.avatar-character__bob')!
    const kids = [...group.children]
    const scarf = kids.findIndex((el) => el.getAttribute('fill') === '#B7EA15')
    const head = kids.findIndex((el) => el.getAttribute('stroke') === '#FDFCF9')
    const glasses = kids.findIndex((el) => el.getAttribute('stroke') === '#ffffff' && el.tagName === 'g' && el.querySelector('circle'))
    expect(scarf).toBeGreaterThanOrEqual(0)
    expect(scarf).toBeLessThan(head)
    expect(glasses).toBeGreaterThan(head)
  })

  it('falls back to a valid head when the stored word no longer exists', () => {
    const { container } = render(<AvatarCharacter config={defaultAvatar('deleted-word')} />)
    expect(label(container)).toBe('Your character, feeling light')
  })

  it('only animates when asked to', () => {
    const still = render(<AvatarCharacter config={defaultAvatar('sore')} />)
    expect(still.container.querySelector('.avatar-character--animated')).toBeNull()
    const moving = render(<AvatarCharacter config={defaultAvatar('sore')} animated />)
    expect(moving.container.querySelector('.avatar-character--animated')).not.toBeNull()
  })
})
