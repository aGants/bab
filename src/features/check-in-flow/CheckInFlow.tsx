import { useState } from 'react'
import type { MessageDescriptor } from '@lingui/core'
import { msg } from '@lingui/core/macro'
import { Trans, useLingui } from '@lingui/react/macro'
import type { WordCard } from '@/i18n'
import type { CheckInEntry } from '@/entities/check-in/types'
import { useCheckInDraft } from './useCheckInDraft'
import { BodyLocationStep, IntensityStep, NotesStep, SummaryStep } from './steps'
import { CheckInStepHeader } from './CheckInStepHeader'
import { IntensityScaleDialog } from './IntensityScaleDialog'
import { Button } from '@/shared/ui'
import './CheckInFlow.css'

type Step = 'location' | 'intensity' | 'notes' | 'confirm'

const STEP_TITLES: Record<Step, MessageDescriptor> = {
  location: msg`Body Map`,
  intensity: msg`Intensity`,
  notes: msg`Notes`,
  confirm: msg`Summary`,
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
  const { t, i18n } = useLingui()
  const [step, setStep] = useState<Step>('intensity')
  const [intensityScaleOpen, setIntensityScaleOpen] = useState(false)
  const draft = useCheckInDraft(word, date, editing)

  const wordName = word.word

  const handleSave = async () => {
    const entry = await draft.commit()
    if (entry) onDone()
  }

  return (
    <div className="check-in-flow" role="dialog" aria-label={t`Check in: ${wordName}`}>
      {/* the design's summary screen is the finished result, so it has no step header */}
      {step !== 'confirm' && (
        <CheckInStepHeader
          title={i18n._(STEP_TITLES[step])}
          onBack={step === 'intensity' ? onCancel : () => setStep(PREVIOUS_STEP[step])}
        />
      )}
      <div className="check-in-flow-content">
        {step === 'intensity' && (
          <IntensityStep
            word={word}
            value={draft.intensity}
            onSelect={draft.setIntensity}
            trigger={draft.trigger}
            onTriggerChange={draft.setTrigger}
            onOpenInfo={() => setIntensityScaleOpen(true)}
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

        {step === 'confirm' && draft.bodyZones.length > 0 && (
          <SummaryStep word={word} />
        )}
      </div>

      {/* Kept outside the scrollable, container-query-sized content box on
          purpose — a step's own content can grow past one screen (long notes,
          a full help list), and a primary action button that scrolls along
          with it is easy to miss or mis-tap on a real phone. Pinning it here
          keeps it visible and reliably tappable regardless of step length. */}
      <div className="check-in-flow-footer">
        {step === 'intensity' && (
          <Button onClick={() => setStep('location')}>
            <Trans>Next</Trans>
          </Button>
        )}
        {step === 'location' && (
          <Button disabled={draft.bodyZones.length === 0} onClick={() => setStep('notes')}>
            <Trans>Next</Trans>
          </Button>
        )}
        {step === 'notes' && (
          <Button onClick={() => setStep('confirm')}>
            <Trans>Next</Trans>
          </Button>
        )}
        {step === 'confirm' && draft.bodyZones.length > 0 && (
          <Button disabled={draft.saving} onClick={handleSave}>
            {draft.saving ? t`Saving…` : editing ? t`Update check-in` : t`Save check-in`}
          </Button>
        )}
      </div>

      {intensityScaleOpen && (
        <IntensityScaleDialog
          level={draft.intensity}
          onClose={() => setIntensityScaleOpen(false)}
        />
      )}
    </div>
  )
}
