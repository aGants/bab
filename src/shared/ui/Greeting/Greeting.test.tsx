import { render } from '@/test/render'
import { describe, expect, it } from 'vitest'
import { Greeting } from './Greeting'

// the hat is the only <g> inside the mascot
const wornHat = (container: HTMLElement) => container.querySelector('.app-greeting-cloud g')

describe('Greeting', () => {
  it('shows the mascot bare when no hat is worn', () => {
    const { container } = render(<Greeting />)
    expect(container.querySelector('.app-greeting-cloud')).toBeTruthy()
    expect(wornHat(container)).toBeNull()
  })

  it('puts the character’s hat on the mascot', () => {
    window.localStorage.setItem('world-hat', 'beanie')
    const { container } = render(<Greeting />)
    expect(wornHat(container)).toBeTruthy()
  })

  it('does the same in the welcome variant', () => {
    window.localStorage.setItem('world-hat', 'cap')
    const { container } = render(<Greeting welcome />)
    expect(wornHat(container)).toBeTruthy()
  })
})

describe('Greeting head', () => {
  const cloud = (container: HTMLElement) => container.querySelector('.app-greeting-cloud path[fill="#FFA7AA"]')

  it('shows the cloud until a feeling has been chosen', () => {
    const { container } = render(<Greeting />)
    expect(cloud(container)).toBeTruthy()
  })

  it('swaps the cloud for the character’s feeling', () => {
    window.localStorage.setItem('world-head-word', 'sharp')
    const { container } = render(<Greeting />)
    expect(cloud(container)).toBeNull()
    expect(container.querySelector('.app-greeting-cloud path')).toBeTruthy()
  })
})
