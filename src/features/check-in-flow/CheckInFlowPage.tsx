import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { WORD_CARDS } from '@/features/word-field/bodyWordsData'
import { checkInRepository } from '@/entities/check-in/checkInRepository'
import type { CheckInEntry } from '@/entities/check-in/types'
import { ROUTES, calendarPath, wordsPath } from '@/routes/paths'
import { PageFrame } from '@/shared/layout'
import { CheckInFlow } from './CheckInFlow'

/** Full-screen route for the check-in wizard — its own PageFrame, its own URL,
 * so it gets a real screen and native back-button behavior for free. */
export const CheckInFlowPage = () => {
  const { wordId } = useParams<{ wordId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const word = WORD_CARDS.find((card) => card.id === wordId)

  const date = searchParams.get('date') ?? undefined
  const entryId = searchParams.get('entryId') ?? undefined

  // undefined = still loading the entry being edited; null = not editing one
  const [editing, setEditing] = useState<CheckInEntry | null | undefined>(entryId ? undefined : null)

  useEffect(() => {
    if (!entryId) {
      setEditing(null)
      return
    }
    setEditing(undefined)
    let cancelled = false
    checkInRepository.getById(entryId).then((found) => {
      if (!cancelled) setEditing(found)
    })
    return () => {
      cancelled = true
    }
  }, [entryId])

  if (!word) {
    return (
      <PageFrame>
        <p>Unknown word.</p>
        <button type="button" onClick={() => navigate(wordsPath(date))}>
          Back to words
        </button>
      </PageFrame>
    )
  }

  if (editing === undefined) {
    return (
      <PageFrame>
        <p>Loading…</p>
      </PageFrame>
    )
  }

  // editing an entry started right from the calendar, skipping the word
  // grid, so cancelling it should return there too; a fresh check-in
  // (with or without a target day) started from the word grid instead.
  const cancelTo = entryId ? calendarPath(date) : wordsPath(date)
  // a date param means this flow was reached from the calendar — land back
  // on that day instead of the "today" home screen once it's saved.
  const doneTo = date ? calendarPath(date) : ROUTES.checkIn

  return (
    <PageFrame>
      <CheckInFlow
        word={word}
        date={date}
        editing={editing ?? undefined}
        onCancel={() => navigate(cancelTo)}
        onDone={() => navigate(doneTo)}
      />
    </PageFrame>
  )
}
