import { useEffect, useState } from 'react'
import { WORD_CARDS } from '@/features/word-field/bodyWordsData'
import { checkInRepository } from '@/entities/check-in/checkInRepository'

/** The word from the user's most recent check-in, or null if they've never
 * checked in (or that word no longer exists). `loaded` is false until the
 * repository has answered, so callers can avoid flashing a wrong default. */
export const useLatestFeeling = () => {
  const [state, setState] = useState<{ wordId: string | null; loaded: boolean }>({
    wordId: null,
    loaded: false,
  })

  useEffect(() => {
    let cancelled = false
    checkInRepository.getAll().then((entries) => {
      if (cancelled) return
      const latest = entries.reduce<(typeof entries)[number] | null>(
        (best, entry) => (!best || entry.createdAt > best.createdAt ? entry : best),
        null,
      )
      const known = latest && WORD_CARDS.some((card) => card.id === latest.wordId)
      setState({ wordId: known ? latest.wordId : null, loaded: true })
    })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
