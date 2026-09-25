import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createLocalStorageDailyLogRepository, type DailyLogRepository } from './dailyLogRepository'

const STORAGE_KEY = 'daily-logs'

describe('dailyLogRepository', () => {
  let repo: DailyLogRepository

  beforeEach(() => {
    repo = createLocalStorageDailyLogRepository()
  })

  it('has no answer for a day nobody logged', async () => {
    expect(await repo.get('2026-03-10')).toBeNull()
    expect(await repo.getRange('2026-03-01', '2026-03-31')).toEqual([])
  })

  it('records period and painkiller answers separately, per day', async () => {
    await repo.setHadPeriod('2026-03-10', true)
    const log = await repo.setTookPainkiller('2026-03-10', false)

    expect(log).toEqual({ date: '2026-03-10', hadPeriod: true, tookPainkiller: false })
    expect(await repo.get('2026-03-10')).toEqual(log)
    expect(await repo.get('2026-03-11')).toBeNull()
  })

  it('tells "not answered" (null) from an explicit "no"', async () => {
    const log = await repo.setHadPeriod('2026-03-10', false)

    expect(log.hadPeriod).toBe(false)
    expect(log.tookPainkiller).toBeNull()
  })

  it('lets an answer be changed', async () => {
    await repo.setHadPeriod('2026-03-10', true)
    await repo.setHadPeriod('2026-03-10', false)

    expect((await repo.get('2026-03-10'))?.hadPeriod).toBe(false)
  })

  it('lists the days in a range, both ends included', async () => {
    for (const date of ['2026-02-28', '2026-03-01', '2026-03-15', '2026-03-31', '2026-04-01']) {
      await repo.setHadPeriod(date, true)
    }

    const days = (await repo.getRange('2026-03-01', '2026-03-31')).map((log) => log.date).sort()

    expect(days).toEqual(['2026-03-01', '2026-03-15', '2026-03-31'])
  })

  it('keeps answers across repository instances', async () => {
    await repo.setTookPainkiller('2026-03-10', true)

    expect((await createLocalStorageDailyLogRepository().get('2026-03-10'))?.tookPainkiller).toBe(true)
  })

  it.each([
    ['text that is not JSON', 'oops'],
    ['JSON that is not an object', '7'],
  ])('starts from nothing for %s, and can be written to again', async (_what, raw) => {
    localStorage.setItem(STORAGE_KEY, raw)

    expect(await repo.get('2026-03-10')).toBeNull()
    await repo.setHadPeriod('2026-03-10', true)
    expect((await repo.get('2026-03-10'))?.hadPeriod).toBe(true)
  })

  it('sees what another tab wrote to storage since the last call', async () => {
    await repo.setHadPeriod('2026-03-10', true)
    expect((await repo.get('2026-03-10'))?.hadPeriod).toBe(true)

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ '2026-03-10': { date: '2026-03-10', hadPeriod: false, tookPainkiller: null } }))

    expect((await repo.get('2026-03-10'))?.hadPeriod).toBe(false)
  })

  describe('reading the stored text', () => {
    afterEach(() => vi.restoreAllMocks())

    it('parses it once, however many calls follow', async () => {
      const raw = JSON.stringify(
        Object.fromEntries(
          Array.from({ length: 365 }, (_, day) => {
            const date = `2026-${String(1 + Math.floor(day / 31)).padStart(2, '0')}-${String(1 + (day % 31)).padStart(2, '0')}`
            return [date, { date, hadPeriod: day % 2 === 0, tookPainkiller: null }]
          }),
        ),
      )
      localStorage.setItem(STORAGE_KEY, raw)
      const parse = vi.spyOn(JSON, 'parse')

      await repo.get('2026-01-05')
      await repo.get('2026-02-05')
      await repo.getRange('2026-01-01', '2026-03-01')

      expect(parse.mock.calls.filter(([text]) => text === raw)).toHaveLength(1)
    })

    it('does not let a caller change what later calls see', async () => {
      await repo.setHadPeriod('2026-03-10', true)
      const held = await repo.get('2026-03-10')

      expect(() => {
        held!.hadPeriod = false
      }).toThrow(TypeError)
      await repo.setHadPeriod('2026-03-10', false)

      expect(held?.hadPeriod).toBe(true)
      expect((await repo.get('2026-03-10'))?.hadPeriod).toBe(false)
    })
  })
})
