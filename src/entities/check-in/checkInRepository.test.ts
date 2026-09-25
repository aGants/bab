import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createLocalStorageCheckInRepository, type CheckInRepository } from './checkInRepository'
import type { NewCheckInEntry } from './types'

const STORAGE_KEY = 'check-ins'

const entry = (patch: Partial<NewCheckInEntry> = {}): NewCheckInEntry => ({
  wordId: 'sore',
  bodyZones: ['kneeLeft'],
  intensity: 4,
  ...patch,
})

const localToday = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

describe('checkInRepository', () => {
  let repo: CheckInRepository

  beforeEach(() => {
    repo = createLocalStorageCheckInRepository()
  })

  describe('saving', () => {
    it('stamps an id, today\'s date and the creation time on a new entry', async () => {
      const saved = await repo.save(entry())

      expect(saved).toMatchObject({ wordId: 'sore', bodyZones: ['kneeLeft'], intensity: 4, date: localToday() })
      expect(saved.id).toBeTruthy()
      expect(new Date(saved.createdAt).toString()).not.toBe('Invalid Date')
    })

    it('files an entry under the day it is logged against', async () => {
      const saved = await repo.save(entry(), '2026-03-14')

      expect(saved.date).toBe('2026-03-14')
    })

    it('gives every entry its own id', async () => {
      const first = await repo.save(entry())
      const second = await repo.save(entry())

      expect(second.id).not.toBe(first.id)
    })

    it('keeps entries across repository instances, as they live in local storage', async () => {
      const saved = await repo.save(entry({ note: 'after the run' }))

      expect(await createLocalStorageCheckInRepository().getById(saved.id)).toEqual(saved)
    })
  })

  describe('reading', () => {
    it('is empty before anything was saved', async () => {
      expect(await repo.getAll()).toEqual([])
      expect(await repo.getById('nope')).toBeNull()
      expect(await repo.getByDate('2026-01-01')).toEqual([])
    })

    it('finds entries by id, by day and by date range (both ends included)', async () => {
      const a = await repo.save(entry({ wordId: 'sore' }), '2026-03-10')
      const b = await repo.save(entry({ wordId: 'tight' }), '2026-03-12')
      const c = await repo.save(entry({ wordId: 'achy' }), '2026-03-12')
      const d = await repo.save(entry({ wordId: 'stiff' }), '2026-03-20')

      expect(await repo.getAll()).toEqual([a, b, c, d])
      expect(await repo.getById(c.id)).toEqual(c)
      expect(await repo.getByDate('2026-03-12')).toEqual([b, c])
      expect(await repo.getRange('2026-03-10', '2026-03-12')).toEqual([a, b, c])
      expect(await repo.getRange('2026-03-11', '2026-03-19')).toEqual([b, c])
    })
  })

  describe('updating', () => {
    it('changes the answers but keeps who, when and which day the entry was', async () => {
      const saved = await repo.save(entry({ note: 'before' }), '2026-03-10')

      const updated = await repo.update(saved.id, entry({ wordId: 'achy', intensity: 8 }))

      expect(updated).toEqual({ ...saved, wordId: 'achy', intensity: 8, note: 'before' })
      expect(await repo.getById(saved.id)).toEqual(updated)
      expect(await repo.getAll()).toHaveLength(1)
    })

    it('says so when the entry is gone', async () => {
      expect(await repo.update('missing', entry())).toBeNull()
    })
  })

  describe('removing', () => {
    it('drops just that entry', async () => {
      const keep = await repo.save(entry())
      const drop = await repo.save(entry())

      await repo.remove(drop.id)

      expect(await repo.getAll()).toEqual([keep])
    })
  })

  describe('entries stored by earlier versions', () => {
    const store = (entries: unknown[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    const old = { id: 'e1', date: '2026-01-05', createdAt: '2026-01-05T10:00:00.000Z', wordId: 'sore', intensity: 3 }

    it('reads the single body zone of the oldest entries as a list', async () => {
      store([{ ...old, bodyZone: 'kneeLeft' }])

      const [migrated] = await repo.getAll()

      expect(migrated.bodyZones).toEqual(['kneeLeft'])
      expect(migrated).not.toHaveProperty('bodyZone')
    })

    it('maps zone ids the body map no longer has onto the ones that replaced them', async () => {
      store([{ ...old, bodyZones: ['chest', 'armLeft', 'thighRight', 'abdomen', 'head'] }])

      const [migrated] = await repo.getAll()

      expect(migrated.bodyZones).toEqual(['chestLeft', 'chestRight', 'upperArmLeft', 'quadRight', 'absLeft', 'absRight', 'head'])
    })

    it('does not list a zone twice when old and new ids meet', async () => {
      store([{ ...old, bodyZones: ['chest', 'chestLeft'] }])

      const [migrated] = await repo.getAll()

      expect(migrated.bodyZones).toEqual(['chestLeft', 'chestRight'])
    })

    it('leaves current entries as they are', async () => {
      store([{ ...old, bodyZones: ['kneeLeft', 'whole'] }])

      expect((await repo.getAll())[0].bodyZones).toEqual(['kneeLeft', 'whole'])
    })
  })

  describe('damaged storage', () => {
    it.each([
      ['text that is not JSON', 'not json {'],
      ['JSON that is not a list', '{"a":1}'],
    ])('starts from nothing for %s, and can be written to again', async (_what, raw) => {
      localStorage.setItem(STORAGE_KEY, raw)

      expect(await repo.getAll()).toEqual([])
      const saved = await repo.save(entry())
      expect(await repo.getAll()).toEqual([saved])
    })
  })

  describe('other tabs', () => {
    it('sees what another tab (or a reset) wrote to storage since the last call', async () => {
      const saved = await repo.save(entry())
      expect(await repo.getAll()).toEqual([saved])

      localStorage.setItem(STORAGE_KEY, JSON.stringify([{ ...saved, id: 'from-elsewhere' }]))
      expect((await repo.getAll()).map(({ id }) => id)).toEqual(['from-elsewhere'])

      localStorage.removeItem(STORAGE_KEY)
      expect(await repo.getAll()).toEqual([])
    })
  })

  describe('reading the stored text', () => {
    const year = Array.from({ length: 365 }, (_, day) => ({
      id: `e${day}`,
      date: `2026-${String(1 + Math.floor(day / 31)).padStart(2, '0')}-${String(1 + (day % 31)).padStart(2, '0')}`,
      createdAt: '2026-01-01T00:00:00.000Z',
      wordId: 'sore',
      bodyZones: ['kneeLeft'],
      intensity: 3,
    }))
    const raw = JSON.stringify(year)
    const parses = (spy: { mock: { calls: unknown[][] } }) => spy.mock.calls.filter(([text]) => text === raw).length

    afterEach(() => vi.restoreAllMocks())

    it('parses it once, however many calls follow', async () => {
      localStorage.setItem(STORAGE_KEY, raw)
      const parse = vi.spyOn(JSON, 'parse')

      await repo.getAll()
      await repo.getById('e10')
      await repo.getByDate('2026-01-05')
      await repo.getRange('2026-01-01', '2026-03-01')
      await repo.getRange('2026-02-01', '2026-04-01')

      expect(parses(parse)).toBe(1)
    })

    it('shares the reading between repository instances too', async () => {
      localStorage.setItem(STORAGE_KEY, raw)
      const parse = vi.spyOn(JSON, 'parse')

      await createLocalStorageCheckInRepository().getAll()
      await createLocalStorageCheckInRepository().getAll()

      expect(parses(parse)).toBeLessThanOrEqual(2)
    })

    it('reads again after its own write, and after another tab changed the storage', async () => {
      const saved = await repo.save(entry())
      expect(await repo.getAll()).toEqual([saved])

      const other = { ...saved, id: 'other' }
      localStorage.setItem(STORAGE_KEY, JSON.stringify([saved, other]))

      expect((await repo.getAll()).map(({ id }) => id)).toEqual([saved.id, 'other'])
    })

    it('does not let a caller change what later calls see', async () => {
      await repo.save(entry({ note: 'original' }))

      const emptied = await repo.getAll()
      emptied.length = 0 // the list is theirs to play with…
      expect(await repo.getAll()).toHaveLength(1)

      const [held] = await repo.getAll()
      expect(() => {
        held.note = 'tampered' // …the entries in it are shared, so they can't be edited in place
      }).toThrow(TypeError)
      expect((await repo.getAll())[0].note).toBe('original')
    })

    it('leaves an entry someone already holds untouched when it is updated', async () => {
      const saved = await repo.save(entry({ note: 'before' }))
      const [held] = await repo.getAll()

      await repo.update(saved.id, entry({ note: 'after' }))

      expect(held.note).toBe('before')
      expect((await repo.getById(saved.id))?.note).toBe('after')
    })
  })
})
