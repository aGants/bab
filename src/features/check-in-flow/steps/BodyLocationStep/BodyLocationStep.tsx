import { useState } from 'react'
import { Trans, useLingui } from '@lingui/react/macro'
import type { BodyZone } from '@/entities/check-in/types'
import { ToggleSwitch } from '@/shared/ui'
import { FemaleBodyBack } from './FemaleBodyBack'
import { FemaleBodyFront } from './FemaleBodyFront'
import './BodyLocationStep.css'

type Facing = 'front' | 'back'

export const BodyLocationStep = ({
  value,
  onToggle,
}: {
  value: BodyZone[]
  onToggle: (zone: BodyZone) => void
}) => {
  const { t } = useLingui()
  const [facing, setFacing] = useState<Facing>('front')

  return (
    <div className="body-location-step">
      <h2>
        <Trans>Where do you feel it?</Trans>
      </h2>
      <p>
        <Trans>Tap the areas on your body. Tap again to remove.</Trans>
      </p>

      <div className="body-location-step__stage">
        <div className="body-location-step__body-wrap">
          {facing === 'front' ? (
            <FemaleBodyFront value={value} onToggle={onToggle} />
          ) : (
            <FemaleBodyBack value={value} onToggle={onToggle} />
          )}
        </div>

        <div className="body-location-step__toggle">
          <ToggleSwitch
            options={[
              { value: 'front', label: t({ message: 'Front', context: 'body view' }) },
              { value: 'back', label: t({ message: 'Back', context: 'body view' }) },
            ]}
            value={facing}
            onChange={setFacing}
          />
        </div>
      </div>
    </div>
  )
}
