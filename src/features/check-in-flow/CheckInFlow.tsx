import { useState } from 'react'
import type { WordCard } from '@/features/word-field/bodyWordsData'
import { useCheckInDraft } from './useCheckInDraft'
import { BodyLocationStep } from './steps/BodyLocationStep'
import { IntensityStep } from './steps/IntensityStep'
import { CheckInStepHeader } from './CheckInStepHeader'
import { Button } from '@/shared/ui/Button/Button'
import './CheckInFlow.css';

type Step = 'location' | 'intensity' | 'confirm'

const STEP_TITLES: Record<Step, string> = {
  location: 'Body Map',
  intensity: 'Intensity',
  confirm: 'Summary',
}

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
    <div className="check-in-flow" role="dialog" aria-label={`Check in: ${word.word}`}>
      <p>
        Checking in: <strong>{word.word}</strong>
      </p>

      <CheckInStepHeader
        title={STEP_TITLES[step]}
        onBack={step === 'location' ? onCancel : () => setStep(step === 'confirm' ? 'intensity' : 'location')}
        onForward={
          step === 'location' && draft.bodyZone !== null
            ? () => setStep('intensity')
            : step === 'intensity' && draft.intensity !== null
              ? () => setStep('confirm')
              : undefined
        }
      />
      <div className="check-in-flow-content">
              {step === 'location' && (
        <>
          <BodyLocationStep value={draft.bodyZone} onSelect={draft.setBodyZone} />
          <Button disabled={draft.bodyZone === null} onClick={() => setStep('intensity')}>
            Next
          </Button>
        </>
      )}

      {step === 'intensity' && (
        <>
          <IntensityStep value={draft.intensity} onSelect={draft.setIntensity} />
          <Button disabled={draft.intensity === null} onClick={() => setStep('confirm')}>
            Next
          </Button>
        </>
      )}

      {step === 'confirm' && (
        <>
          <p>
            Zone: {draft.bodyZone} · Intensity: {draft.intensity}
          </p>
          <Button disabled={draft.saving} onClick={handleSave}>
            {draft.saving ? 'Saving…' : 'Save check-in'}
          </Button>
        </>
      )}
      </div>
    </div>
  )
}
