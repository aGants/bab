import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// each screen's chunk, replaced by a stub that notes when it gets downloaded (imported)
const { downloaded, stubScreen } = vi.hoisted(() => {
  const downloaded: string[] = []
  const stubScreen = (name: string, exports: Record<string, unknown>) => () => {
    downloaded.push(name)
    return exports
  }
  return { downloaded, stubScreen }
})
vi.mock('./features/check-in/CheckIn', stubScreen('CheckIn', { CheckIn: () => null }))
vi.mock('./features/word-field/BodyWordCards', stubScreen('BodyWordCards', { default: () => null }))
vi.mock('./features/check-in-flow/CheckInFlowPage', stubScreen('CheckInFlowPage', { CheckInFlowPage: () => null }))
vi.mock('./features/calendar/CalendarPage', stubScreen('CalendarPage', { CalendarPage: () => null }))
vi.mock('./features/avatar/AvatarPage', stubScreen('AvatarPage', { AvatarPage: () => null }))
vi.mock('./features/settings/SettingsPage', stubScreen('SettingsPage', { SettingsPage: () => null }))

const ALL_SCREENS = ['AvatarPage', 'BodyWordCards', 'CalendarPage', 'CheckIn', 'CheckInFlowPage', 'SettingsPage']

const useConnection = (connection: unknown) =>
  Object.defineProperty(navigator, 'connection', { value: connection, configurable: true })

/** A fresh copy of the router module, so nothing is left over from an earlier download. */
const loadRouter = async () => {
  vi.resetModules()
  return import('./router')
}

describe('preloadRoutes', () => {
  beforeEach(() => {
    downloaded.length = 0
  })

  afterEach(() => {
    Reflect.deleteProperty(navigator, 'connection')
  })

  it('downloads every screen in the background', async () => {
    const { preloadRoutes } = await loadRouter()

    preloadRoutes()

    await vi.waitFor(() => expect([...downloaded].sort()).toEqual(ALL_SCREENS))
  })

  it.each([
    ['the visitor asked to save data', { saveData: true, effectiveType: '4g' }],
    ['the connection is very slow', { saveData: false, effectiveType: '2g' }],
  ])('downloads nothing when %s', async (_reason, connection) => {
    useConnection(connection)
    const { preloadRoutes } = await loadRouter()

    preloadRoutes()
    await new Promise((resolve) => setTimeout(resolve, 50))

    expect(downloaded).toEqual([])
  })
})
