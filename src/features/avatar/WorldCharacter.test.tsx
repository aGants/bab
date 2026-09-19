import { render } from '@/test/render'
import { describe, expect, it } from 'vitest'
import { WORDS } from '@/entities/word'
import { WorldCharacter } from './WorldCharacter'

const label = (container: HTMLElement) => container.querySelector('svg')?.getAttribute('aria-label')

describe('WorldCharacter', () => {
  it('wears the cloud by default', () => {
    const { container } = render(<WorldCharacter />)
    expect(label(container)).toBe('Your character')
  })

  it.each(WORDS.map((word) => word.id))('wears the %s shape as its head', (id) => {
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

  it('puts the hat on a feeling head too', () => {
    const bare = render(<WorldCharacter headWordId="sharp" />).container
    const { container } = render(<WorldCharacter headWordId="sharp" hatId="cap" />)
    expect(label(container)).toBe('Your character, feeling sharp, wearing a cap')
    expect(container.querySelectorAll('path').length).toBeGreaterThan(bare.querySelectorAll('path').length)
  })

  it('has a pink body unless told otherwise, and takes another colour', () => {
    const body = (container: HTMLElement) => container.querySelector('rect')?.getAttribute('fill')
    expect(body(render(<WorldCharacter />).container)).toBe('#FEA7A9')
    expect(body(render(<WorldCharacter bodyColorId="teal" />).container)).toBe('#3DBFAE')
  })
})
