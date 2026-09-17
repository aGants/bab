import type { BodyZone } from '@/entities/check-in/types'

// debug-simple: flat list of buttons, one per zone. Swap for a real body-map
// silhouette later without touching CheckInFlow — it only needs onSelect(zone).
const ZONES: BodyZone[] = [
  'head', 'neck', 'shoulderLeft', 'shoulderRight', 'chest', 'upperBack', 'lowerBack',
  'abdomen', 'armLeft', 'armRight', 'handLeft', 'handRight', 'hipLeft', 'hipRight',
  'thighLeft', 'thighRight', 'kneeLeft', 'kneeRight', 'calfLeft', 'calfRight',
  'ankleLeft', 'ankleRight', 'footLeft', 'footRight', 'whole',
]

export const BodyLocationStep = ({
  value,
  onSelect,
}: {
  value: BodyZone | null
  onSelect: (zone: BodyZone) => void
}) => (
  <div>
    <h2>Where do you feel it?</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {ZONES.map((zone) => (
        <button
          key={zone}
          type="button"
          aria-pressed={value === zone}
          onClick={() => onSelect(zone)}
          style={{ fontWeight: value === zone ? 700 : 400 }}
        >
          {zone}
        </button>
      ))}
    </div>
  </div>
)
