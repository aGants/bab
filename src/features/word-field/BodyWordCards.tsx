import { useEffect, useState, type CSSProperties } from 'react'
import { GRID_COLS, WORD_CARDS, type WordCard } from './bodyWordsData'
import { wordColor } from './helpers/shapes'
import { WordCardButton } from './WordCardButton'
import { useScrollToSelected } from './helpers/useScrollToSelected'
import { Link, useSearchParams } from 'react-router-dom'
import { ROUTES, calendarPath, checkInFlowPath } from '@/routes/paths'
import { PageFrame } from '@/shared/layout'
import { Greeting, TabBar } from '@/shared/ui'
import { checkInRepository } from '@/entities/check-in/checkInRepository'
import './BodyWordCards.css'

export default function BodyWordCards() {
  const [selected, setSelected] = useState<WordCard | null>(null)
  const { viewportRef, detailRef, registerCard } = useScrollToSelected(selected)
  const [searchParams] = useSearchParams()
  // present when this is the first step of logging a check-in for a past day
  // picked on the calendar, rather than today's check-in from the home screen
  const date = searchParams.get('date') ?? undefined
  // present when editing an existing check-in — its word is preselected below
  // so changing the "feeling" is just picking a different card, same as new
  const entryId = searchParams.get('entryId') ?? undefined

  useEffect(() => {
    if (!entryId) return
    checkInRepository.getById(entryId).then((entry) => {
      if (!entry) return
      const word = WORD_CARDS.find((card) => card.id === entry.wordId)
      if (word) setSelected(word)
    })
  }, [entryId])

  return (
    <PageFrame>
      <Greeting />
      <header className="word-cards-header">
        <Link className="back-arrow" to={date ? calendarPath(date) : ROUTES.checkIn}>←</Link>
        <h1>How is your body feeling today?</h1>
      </header>
      <p className="word-cards-section-label">Body sensations</p>

      <div className="word-grid-viewport" ref={viewportRef}>
        <div className="word-grid" style={{ '--grid-cols': GRID_COLS } as CSSProperties}>
          {WORD_CARDS.map((card) => (
            <WordCardButton
              key={card.id}
              card={card}
              selected={selected}
              onSelect={setSelected}
              cardRef={registerCard(card.id)}
            />
          ))}
        </div>
      </div>

      {selected && (
        <div className="word-detail" role="dialog" aria-label={selected.word} ref={detailRef}>
          <button
            type="button"
            className="word-detail-close"
            onClick={() => setSelected(null)}
            aria-label="Close detail"
          >
            ✕
          </button>
          <strong className="word-detail-title" style={{ color: wordColor(selected.id) }}>
            {selected.word}
          </strong>
          <p className="word-detail-metaphor">{selected.metaphor}</p>
          <div className="word-detail-description">
            <p className="word-detail-feels">
            <span>IT FEELS LIKE</span>
            {selected.feelsLike}
          </p>
            <Link className="word-detail-check-in" to={checkInFlowPath(selected.id, date, entryId)}>→</Link>
          </div>
        </div>
      )}
      <TabBar />
    </PageFrame>
  )
}
