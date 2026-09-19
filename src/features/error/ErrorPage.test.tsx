import { render, screen } from '@/test/render'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { errorScreenFor } from '@/i18n'
import { ErrorPage } from './ErrorPage'

const Broken = () => {
  throw new Error('boom')
}

const ERROR_SCREEN = errorScreenFor('en')

describe('ErrorPage', () => {
  afterEach(() => vi.restoreAllMocks())

  it('replaces a crashed route with a friendly message and a way back to the start', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const assign = vi.fn()
    vi.spyOn(window, 'location', 'get').mockReturnValue({ ...window.location, assign })
    const router = createMemoryRouter([{ path: '/', element: <Broken />, errorElement: <ErrorPage /> }])

    render(<RouterProvider router={router} />)

    expect(screen.getByRole('heading', { name: ERROR_SCREEN.title })).toBeTruthy()
    expect(screen.getByText(ERROR_SCREEN.message)).toBeTruthy()

    await userEvent.click(screen.getByRole('button', { name: ERROR_SCREEN.action }))
    expect(assign).toHaveBeenCalledWith('/')
  })
})
