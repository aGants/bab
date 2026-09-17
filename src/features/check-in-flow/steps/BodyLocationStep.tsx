import { useState } from 'react'
import Body, { type ExtendedBodyPart, type Slug } from 'react-muscle-highlighter'
import type { BodyZone } from '@/entities/check-in/types'
import { ToggleSwitch } from '@/shared/ui'
import {
  BACK_FORWARD,
  BODY_FILL,
  BODY_STROKE,
  FRONT_FORWARD,
  PELVIC_HOTSPOT,
  SCALE,
  SELECTED_FILL,
  WRIST_HOTSPOT_LEFT,
  WRIST_HOTSPOT_RIGHT,
  matchesZone,
  resolveZone,
  sidedZone,
  type Side,
} from './bodyZoneMap'
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

  const forward = facing === 'front' ? FRONT_FORWARD : BACK_FORWARD

  const handlePress = (part: ExtendedBodyPart, side?: Side) => {
    if (!part.slug) return
    const entry = forward[part.slug]
    if (!entry) return
    const zone = resolveZone(entry, side)
    if (zone) onSelect(zone)
  }

  // The library's body assets bake in their own per-muscle fill color, which
  // silently beats `defaultFill` unless every slug gets an explicit (even
  // color-less) data entry — that strips the baked color so defaultFill
  // applies. Every slug whose mapped zone matches the current selection gets
  // colored (not just one "representative" muscle) so clicking any of them
  // visibly lights up, regardless of which one was actually clicked.
  const data: ExtendedBodyPart[] = (Object.keys(forward) as Slug[]).map((slug) => {
    const entry = forward[slug]!
    if (value && matchesZone(entry, 'left', value)) return { slug, side: 'left', color: SELECTED_FILL }
    if (value && matchesZone(entry, 'right', value)) return { slug, side: 'right', color: SELECTED_FILL }
    if (value && matchesZone(entry, undefined, value)) return { slug, color: SELECTED_FILL }
    return { slug }
  })

  return (
    <div>
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
        <Body
          gender="female"
          side={facing}
          data={data}
          onBodyPartPress={handlePress}
          defaultFill={BODY_FILL}
          defaultStroke={BODY_STROKE}
          defaultStrokeWidth={1}
          border={BODY_STROKE}
          scale={SCALE}
        />
        {facing === 'front' && (
          <button
            type="button"
            className="body-location-step__hotspot"
            aria-label="pelvic area"
            aria-pressed={value === 'abdomen'}
            onClick={() => onSelect('abdomen')}
            style={{
              left: `${PELVIC_HOTSPOT.left}%`,
              top: `${PELVIC_HOTSPOT.top}%`,
              width: `${PELVIC_HOTSPOT.width}%`,
              height: `${PELVIC_HOTSPOT.height}%`,
            }}
          />
        )}
        {([
          ['left', WRIST_HOTSPOT_LEFT],
          ['right', WRIST_HOTSPOT_RIGHT],
        ] as const).map(([side, spot]) => {
          const zone = sidedZone('hand', side)
          return (
            <button
              key={side}
              type="button"
              className="body-location-step__hotspot"
              aria-label={`${side} wrist`}
              aria-pressed={value === zone}
              onClick={() => onSelect(zone)}
              style={{
                left: `${spot.left}%`,
                top: `${spot.top}%`,
                width: `${spot.width}%`,
                height: `${spot.height}%`,
              }}
            />
          )
        })}
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
