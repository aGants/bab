import { useState } from 'react'
import type { BodyZone } from '@/entities/check-in/types'
import { ToggleSwitch } from '@/shared/ui'
import { FemaleBodyBack } from './FemaleBodyBack'
import { FemaleBodyFront } from './FemaleBodyFront'
import './BodyLocationStep.css'

type Facing = 'front' | 'back'

export const BodyLocationStep = ({
  value,
  onSelect,
}: {
  value: BodyZone | null
  onSelect: (zone: BodyZone) => void
}) => {
  const [facing, setFacing] = useState<Facing>('front')

  return (
    <div className="body-location-step">
      <h2>Where do you feel it?</h2>
      <p>Tap the areas on your body.</p>

      <div className="body-location-step__toggle">
        <ToggleSwitch
          options={[
            { value: 'front', label: 'Front' },
            { value: 'back', label: 'Back' },
          ]}
          value={facing}
          onChange={setFacing}
        />
      </div>

      <div className="body-location-step__body-wrap">
        {facing === 'front' ? (
          <FemaleBodyFront value={value} onSelect={onSelect} />
        ) : (
          <FemaleBodyBack value={value} onSelect={onSelect} />
        )}
      </div>

      <button
        type="button"
        className="body-location-step__whole"
        aria-pressed={value === 'whole'}
        onClick={() => onSelect('whole')}
      >
        everywhere / hard to say
      </button>
    </div>
  )
}
