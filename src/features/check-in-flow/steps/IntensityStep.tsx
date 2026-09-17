import type { CheckInIntensity } from '@/entities/check-in/types'

// debug-simple: plain buttons 0..10. Swap for the drag-to-resize word shape
// later without touching CheckInFlow — it only needs onSelect(level).
const LEVELS: CheckInIntensity[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export const IntensityStep = ({
  value,
  onSelect,
}: {
  value: CheckInIntensity | null
  onSelect: (intensity: CheckInIntensity) => void
}) => (
  <div>
    <h2>How big is it?</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {LEVELS.map((level) => (
        <button
          key={level}
          type="button"
          aria-pressed={value === level}
          onClick={() => onSelect(level)}
          style={{ fontWeight: value === level ? 700 : 400 }}
        >
          {level}
        </button>
      ))}
    </div>
  </div>
)
