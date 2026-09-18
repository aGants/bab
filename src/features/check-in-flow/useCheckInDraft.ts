import { useState } from 'react'
import type { WordCard } from '@/features/word-field/bodyWordsData'
import {
  DEFAULT_CHECK_IN_INTENSITY,
  type BodyZone,
  type CheckInEntry,
  type CheckInIntensity,
  type Energy,
} from '@/entities/check-in/types'
import { checkInRepository } from '@/entities/check-in/checkInRepository'

/** Holds the in-progress answers for one check-in flow and commits them
 * to the repository once both are picked. Nothing here is saved until commit().
 * `date` lets the flow log against a past day instead of today. Pass `editing`
 * to seed the draft from an existing entry and patch it in place on commit,
 * instead of creating a new one. */
export const useCheckInDraft = (word: WordCard, date?: string, editing?: CheckInEntry) => {
  const [bodyZone, setBodyZone] = useState<BodyZone | null>(editing?.bodyZone ?? null)
  const [intensity, setIntensity] = useState<CheckInIntensity | null>(
    editing?.intensity ?? DEFAULT_CHECK_IN_INTENSITY,
  )
  const [energy, setEnergy] = useState<Energy | null>(editing?.energy ?? null)
  const [note, setNote] = useState(editing?.note ?? '')
  const [saving, setSaving] = useState(false)

  const commit = async (): Promise<CheckInEntry | null> => {
    if (bodyZone === null || intensity === null) return null
    setSaving(true)
    try {
      const payload = {
        wordId: word.id,
        bodyZone,
        intensity,
        energy: energy ?? undefined,
        note: note.trim() || undefined,
      }
      return editing ? await checkInRepository.update(editing.id, payload) : await checkInRepository.save(payload, date)
    } finally {
      setSaving(false)
    }
  }

  return {
    bodyZone,
    setBodyZone,
    intensity,
    setIntensity,
    energy,
    setEnergy,
    note,
    setNote,
    saving,
    commit,
  }
}
