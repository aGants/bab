import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useUserProfile } from './useUserProfile'

const Name = () => <p data-testid="name">{useUserProfile().name}</p>

const Editor = () => {
  const { setName } = useUserProfile()
  return <button onClick={() => setName('Anna')}>save</button>
}

describe('useUserProfile', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('updates every mounted consumer when the name is saved', async () => {
    render(
      <>
        <Name />
        <Editor />
      </>,
    )

    await act(async () => {
      screen.getByRole('button', { name: 'save' }).click()
    })

    expect(screen.getByTestId('name').textContent).toBe('Anna')
  })
})
