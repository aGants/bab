import { useState } from 'react'
import type { WordCard } from '@/features/word-field/bodyWordsData'
import type { CheckInEntry } from '@/entities/check-in/types'
import { useCheckInDraft } from './useCheckInDraft'
import { BodyLocationStep, IntensityStep, NotesStep, SummaryStep } from './steps'
import { CheckInStepHeader } from './CheckInStepHeader'
import { Button } from '@/shared/ui'
import './CheckInFlow.css'

type Step = 'location' | 'intensity' | 'notes' | 'confirm'

const STEP_TITLES: Record<Step, string> = {
  location: 'Body Map',
  intensity: 'Intensity',
  notes: 'Notes',
  confirm: 'Summary',
}

const PREVIOUS_STEP: Record<Step, Step> = {
  intensity: 'intensity',
  location: 'intensity',
  notes: 'location',
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
  const [step, setStep] = useState<Step>('intensity')
  const draft = useCheckInDraft(word, date, editing)

  const handleSave = async () => {
    const entry = await draft.commit()
    if (entry) onDone()
  }

  return (
    <div className="check-in-flow" role="dialog" aria-label={`Check in: ${word.word}`}>
      <CheckInStepHeader
        title={STEP_TITLES[step]}
        onBack={step === 'intensity' ? onCancel : () => setStep(PREVIOUS_STEP[step])}
        onForward={
          step === 'intensity' && draft.intensity !== null
            ? () => setStep('location')
            : step === 'location' && draft.bodyZones.length > 0
              ? () => setStep('notes')
              : step === 'notes'
                ? () => setStep('confirm')
                : undefined
        }
      />
      <div className="check-in-flow-content">
        {step === 'intensity' && (
          <IntensityStep
            word={word}
            value={draft.intensity}
            onSelect={draft.setIntensity}
            trigger={draft.trigger}
            onTriggerChange={draft.setTrigger}
          />
        )}

        {step === 'location' && (
          <BodyLocationStep value={draft.bodyZones} onToggle={draft.toggleBodyZone} />
        )}

        {step === 'notes' && (
          <NotesStep
            energy={draft.energy}
            onEnergyChange={draft.setEnergy}
            note={draft.note}
            onNoteChange={draft.setNote}
            date={date}
          />
        )}

        {step === 'confirm' && draft.bodyZones.length > 0 && draft.intensity !== null && (
          <SummaryStep word={word} bodyZones={draft.bodyZones} intensity={draft.intensity} />
        )}
      </div>

      {/* Kept outside the scrollable, container-query-sized content box on
          purpose — a step's own content can grow past one screen (long notes,
          a full help list), and a primary action button that scrolls along
          with it is easy to miss or mis-tap on a real phone. Pinning it here
          keeps it visible and reliably tappable regardless of step length. */}
      <div className="check-in-flow-footer">
        {step === 'intensity' && (
          <Button disabled={draft.intensity === null} onClick={() => setStep('location')}>
            Next
          </Button>
        )}
        {step === 'location' && (
          <Button disabled={draft.bodyZones.length === 0} onClick={() => setStep('notes')}>
            Next
          </Button>
        )}
        {step === 'notes' && <Button onClick={() => setStep('confirm')}>Next</Button>}
        {step === 'confirm' && draft.bodyZones.length > 0 && draft.intensity !== null && (
          <Button disabled={draft.saving} onClick={handleSave}>
            {draft.saving ? 'Saving…' : editing ? 'Update check-in' : 'Save check-in'}
          </Button>
        )}
      </div>
    </div>
  )
}
