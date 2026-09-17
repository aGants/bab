import { useState } from 'react'
import type { WordCard } from '@/features/word-field/bodyWordsData'
import { useCheckInDraft } from './useCheckInDraft'
import { BodyLocationStep } from './BodyLocationStep'
import { IntensityStep } from './IntensityStep'

type Step = 'location' | 'intensity' | 'confirm'

/** Debug-simple wizard: word -> body zone -> intensity -> save. Steps are plain
 * buttons on purpose; the visual pass (body-map silhouette, resize gesture) comes later. */
export const CheckInFlow = ({
  word,
  onDone,
  onCancel,
}: {
  word: WordCard
  onDone: () => void
  onCancel: () => void
}) => {
  const [step, setStep] = useState<Step>('location')
  const draft = useCheckInDraft(word)

  const handleSave = async () => {
    const entry = await draft.commit()
    if (entry) onDone()
  }

  return (
    <div role="dialog" aria-label={`Check in: ${word.word}`} style={{ padding: 16, border: '1px solid currentColor' }}>
      <button type="button" onClick={onCancel}>
        ✕ cancel
      </button>
      <p>
        Checking in: <strong>{word.word}</strong>
      </p>

      {step === 'location' && (
        <>
          <BodyLocationStep value={draft.bodyZone} onSelect={draft.setBodyZone} />
          <button type="button" disabled={draft.bodyZone === null} onClick={() => setStep('intensity')}>
            Next
          </button>
        </>
      )}

      {step === 'intensity' && (
        <>
          <IntensityStep value={draft.intensity} onSelect={draft.setIntensity} />
          <button type="button" onClick={() => setStep('location')}>
            Back
          </button>
          <button type="button" disabled={draft.intensity === null} onClick={() => setStep('confirm')}>
            Next
          </button>
        </>
      )}

      {step === 'confirm' && (
        <>
          <p>
            Zone: {draft.bodyZone} · Intensity: {draft.intensity}
          </p>
          <button type="button" onClick={() => setStep('intensity')}>
            Back
          </button>
          <button type="button" disabled={draft.saving} onClick={handleSave}>
            {draft.saving ? 'Saving…' : 'Save check-in'}
          </button>
        </>
      )}
    </div>
  )
}
