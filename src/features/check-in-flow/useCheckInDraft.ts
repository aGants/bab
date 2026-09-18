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
 * to the repository once both are picked. Nothing here is saved until commit(). */
export const useCheckInDraft = (word: WordCard) => {
  const [bodyZone, setBodyZone] = useState<BodyZone | null>(null)
  const [intensity, setIntensity] = useState<CheckInIntensity | null>(DEFAULT_CHECK_IN_INTENSITY)
  const [energy, setEnergy] = useState<Energy | null>(null)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const commit = async (): Promise<CheckInEntry | null> => {
    if (bodyZone === null || intensity === null) return null
    setSaving(true)
    try {
      return await checkInRepository.save({
        wordId: word.id,
        bodyZone,
        intensity,
        energy: energy ?? undefined,
        note: note.trim() || undefined,
      })
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
