import type { Energy } from '@/entities/check-in/types'
import './NotesStep.css'

const ENERGY_OPTIONS: { value: Energy; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Okay' },
  { value: 'low', label: 'Low' },
]

export const NotesStep = ({
  energy,
  onEnergyChange,
  note,
  onNoteChange,
}: {
  energy: Energy | null
  onEnergyChange: (energy: Energy) => void
  note: string
  onNoteChange: (note: string) => void
}) => (
  <div>
    <h2>Anything else you want to share?</h2>

    <p className="notes-step__label">Energy</p>
    <div className="notes-step__energy">
      {ENERGY_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className="notes-step__energy-pill"
          aria-pressed={energy === option.value}
          onClick={() => onEnergyChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>

    <p className="notes-step__label">Additional Notes</p>
    <textarea
      className="notes-step__textarea"
      value={note}
      onChange={(event) => onNoteChange(event.target.value)}
      placeholder="Anything you want to remember about this…"
    />
  </div>
)
