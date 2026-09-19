import { useState } from 'react'
import type { WordCard } from '@/i18n'
import {
  DEFAULT_CHECK_IN_INTENSITY,
  DEFAULT_ENERGY,
  type BodyZone,
  type CheckInEntry,
  type CheckInIntensity,
  type Energy,
  type Trigger,
} from '@/entities/check-in/types'
import { checkInRepository } from '@/entities/check-in/checkInRepository'

/** Holds the in-progress answers for one check-in flow and commits them
 * to the repository once both are picked. Nothing here is saved until commit().
 * `date` lets the flow log against a past day instead of today. Pass `editing`
 * to seed the draft from an existing entry and patch it in place on commit,
 * instead of creating a new one. */
export const useCheckInDraft = (word: WordCard, date?: string, editing?: CheckInEntry) => {
  const [bodyZones, setBodyZones] = useState<BodyZone[]>(editing?.bodyZones ?? [])
  const [intensity, setIntensity] = useState<CheckInIntensity>(
    editing?.intensity ?? DEFAULT_CHECK_IN_INTENSITY,
  )
  const [energy, setEnergy] = useState<Energy | null>(editing?.energy ?? DEFAULT_ENERGY)
  const [trigger, setTrigger] = useState<Trigger | null>(editing?.trigger ?? null)
  const [note, setNote] = useState(editing?.note ?? '')
  const [saving, setSaving] = useState(false)

  const toggleBodyZone = (zone: BodyZone) => {
    setBodyZones((zones) =>
      zones.includes(zone) ? zones.filter((existing) => existing !== zone) : [...zones, zone],
    )
  }

  const commit = async (): Promise<CheckInEntry | null> => {
    if (bodyZones.length === 0) return null
    setSaving(true)
    try {
      const payload = {
        wordId: word.id,
        bodyZones,
        intensity,
        energy: energy ?? undefined,
        trigger: trigger ?? undefined,
        note: note.trim() || undefined,
      }
      return editing ? await checkInRepository.update(editing.id, payload) : await checkInRepository.save(payload, date)
    } finally {
      setSaving(false)
    }
  }

  return {
    bodyZones,
    toggleBodyZone,
    intensity,
    setIntensity,
    energy,
    setEnergy,
    trigger,
    setTrigger,
    note,
    setNote,
    saving,
    commit,
  }
}
