import { render } from '@/test/render'
import { describe, expect, it } from 'vitest'
import { WORD_CARDS } from '@/i18n'
import { WorldCharacter } from './WorldCharacter'

const label = (container: HTMLElement) => container.querySelector('svg')?.getAttribute('aria-label')

describe('WorldCharacter', () => {
  it('wears the cloud by default', () => {
    const { container } = render(<WorldCharacter />)
    expect(label(container)).toBe('Your character')
  })

  it.each(WORD_CARDS.map((card) => card.id))('wears the %s shape as its head', (id) => {
    const cloud = render(<WorldCharacter />).container.innerHTML
    const { container } = render(<WorldCharacter headWordId={id} />)
    expect(label(container)).toBe(`Your character, feeling ${id}`)
    expect(container.innerHTML).not.toBe(cloud)
  })

  it('falls back to the cloud for a word that no longer exists', () => {
    const cloud = render(<WorldCharacter />).container.innerHTML
    const { container } = render(<WorldCharacter headWordId="gone" />)
    expect(container.innerHTML).toBe(cloud)
  })
})
