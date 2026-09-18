import { useState } from 'react'
import type { WordCard } from '@/features/word-field/bodyWordsData'
import type { CheckInEntry } from '@/entities/check-in/types'
import { useCheckInDraft } from './useCheckInDraft'
import { BodyLocationStep, IntensityStep, NotesStep, SummaryStep } from './steps'
import { CheckInStepHeader } from './CheckInStepHeader'
import { Button } from '@/shared/ui'
import './CheckInFlow.css';

type Step = 'location' | 'intensity' | 'notes' | 'confirm'

const STEP_TITLES: Record<Step, string> = {
  location: 'Body Map',
  intensity: 'Intensity',
  notes: 'Notes',
  confirm: 'Summary',
}

const PREVIOUS_STEP: Record<Step, Step> = {
  location: 'location',
  intensity: 'location',
  notes: 'intensity',
  confirm: 'notes',
}

/** Debug-simple wizard: word -> body zone -> intensity -> save. Steps are plain
 * buttons on purpose; the visual pass (body-map silhouette, resize gesture) comes later. */
export const CheckInFlow = ({
  word,
  date,
  editing,
  onDone,
  onCancel,
}: {
  word: WordCard
  /** day to log this check-in against — omit to use today */
  date?: string
  /** existing entry being edited, instead of creating a new one */
  editing?: CheckInEntry
  onDone: () => void
  onCancel: () => void
}) => {
  const [step, setStep] = useState<Step>('location')
  const draft = useCheckInDraft(word, date, editing)

  const handleSave = async () => {
    const entry = await draft.commit()
    if (entry) onDone()
  }

  return (
    <div className="check-in-flow" role="dialog" aria-label={`Check in: ${word.word}`}>
      <CheckInStepHeader
        title={STEP_TITLES[step]}
        onBack={step === 'location' ? onCancel : () => setStep(PREVIOUS_STEP[step])}
        onForward={
          step === 'location' && draft.bodyZones.length > 0
            ? () => setStep('intensity')
            : step === 'intensity' && draft.intensity !== null
              ? () => setStep('notes')
              : step === 'notes'
                ? () => setStep('confirm')
                : undefined
        }
      />
      <div className="check-in-flow-content">
              {step === 'location' && (
        <>
          <BodyLocationStep value={draft.bodyZones} onToggle={draft.toggleBodyZone} />
          <Button disabled={draft.bodyZones.length === 0} onClick={() => setStep('intensity')}>
            Next
          </Button>
        </>
      )}

      {step === 'intensity' && (
        <>
          <IntensityStep
            word={word}
            value={draft.intensity}
            onSelect={draft.setIntensity}
            trigger={draft.trigger}
            onTriggerChange={draft.setTrigger}
          />
          <Button disabled={draft.intensity === null} onClick={() => setStep('notes')}>
            Next
          </Button>
        </>
      )}

      {step === 'notes' && (
        <>
          <NotesStep
            energy={draft.energy}
            onEnergyChange={draft.setEnergy}
            note={draft.note}
            onNoteChange={draft.setNote}
            date={date}
          />
          <Button onClick={() => setStep('confirm')}>Next</Button>
        </>
      )}

      {step === 'confirm' && draft.bodyZones.length > 0 && draft.intensity !== null && (
        <>
          <SummaryStep word={word} bodyZones={draft.bodyZones} intensity={draft.intensity} />
          <Button disabled={draft.saving} onClick={handleSave}>
            {draft.saving ? 'Saving…' : editing ? 'Update check-in' : 'Save check-in'}
          </Button>
        </>
      )}
      </div>
    </div>
  )
}
