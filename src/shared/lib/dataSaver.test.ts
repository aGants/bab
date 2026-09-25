import { afterEach, describe, expect, it } from 'vitest'
import { isDataSaverOn } from './dataSaver'

const useConnection = (connection: unknown) =>
  Object.defineProperty(navigator, 'connection', { value: connection, configurable: true })

describe('isDataSaverOn', () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, 'connection')
  })

  it('is off when the browser says nothing about the connection', () => {
    expect(isDataSaverOn()).toBe(false)
  })

  it('is on when the visitor asked to save data', () => {
    useConnection({ saveData: true, effectiveType: '4g' })
    expect(isDataSaverOn()).toBe(true)
  })

  it.each(['slow-2g', '2g'])('is on for a very slow connection (%s)', (effectiveType) => {
    useConnection({ saveData: false, effectiveType })
    expect(isDataSaverOn()).toBe(true)
  })

  it.each(['3g', '4g'])('stays off for an ordinary connection (%s)', (effectiveType) => {
    useConnection({ saveData: false, effectiveType })
    expect(isDataSaverOn()).toBe(false)
  })
})
