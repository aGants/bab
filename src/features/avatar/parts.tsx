import type { ReactNode } from 'react'
import { BODY_COLORS } from '@/entities/avatar/catalog'
import type { AccessoryId, BodyColorId, BodyId, FaceId } from '@/entities/avatar/types'
import { HEAD_CENTER } from './headGeometry'

/** Everything below is drawn on the character's 200×260 canvas. */

const BODY_PATHS: Record<BodyId, string> = {
  arch: 'M40 152 Q40 112 100 112 Q160 112 160 152 L160 232 Q160 250 142 250 L124 250 Q108 250 108 232 L108 196 Q100 184 92 196 L92 232 Q92 250 76 250 L58 250 Q40 250 40 232 Z',
  bean: 'M56 140 Q56 112 100 112 Q144 112 144 140 L144 226 Q144 250 100 250 Q56 250 56 226 Z',
  pear: 'M72 124 Q72 110 100 110 Q128 110 128 124 Q128 150 152 190 Q166 250 100 250 Q34 250 48 190 Q72 150 72 124 Z',
  round: 'M38 190 A62 60 0 1 0 162 190 A62 60 0 1 0 38 190 Z',
}

export const Body = ({ id, color }: { id: BodyId; color: BodyColorId }) => (
  <path d={BODY_PATHS[id]} fill={BODY_COLORS[color].hex} />
)

const { x: FX, y: FY } = HEAD_CENTER
const EYE_DX = 16
const EYE_Y = FY - 2

const line = { fill: 'none', strokeWidth: 3.4, strokeLinecap: 'round' as const }

const dots = (radius: number) => (
  <>
    <circle cx={FX - EYE_DX} cy={EYE_Y} r={radius} />
    <circle cx={FX + EYE_DX} cy={EYE_Y} r={radius} />
  </>
)

const arcEye = (cx: number, up: boolean) => (
  <path d={`M${cx - 5} ${EYE_Y} Q${cx} ${EYE_Y + (up ? -6 : 6)} ${cx + 5} ${EYE_Y}`} {...line} />
)

const smile = `M${FX - 12} ${FY + 14} Q${FX} ${FY + 25} ${FX + 12} ${FY + 14}`

/** Drawn in `ink` — the caller picks a colour that reads on the head's fill. */
const FACE_PARTS: Record<FaceId, ReactNode> = {
  happy: (
    <>
      {dots(4.5)}
      <path d={smile} {...line} />
    </>
  ),
  calm: (
    <>
      {arcEye(FX - EYE_DX, true)}
      {arcEye(FX + EYE_DX, true)}
      <path d={`M${FX - 7} ${FY + 16} Q${FX} ${FY + 21} ${FX + 7} ${FY + 16}`} {...line} />
    </>
  ),
  sleepy: (
    <>
      {arcEye(FX - EYE_DX, false)}
      {arcEye(FX + EYE_DX, false)}
      <ellipse cx={FX} cy={FY + 18} rx={3.2} ry={4} />
    </>
  ),
  surprised: (
    <>
      {dots(5.5)}
      <ellipse cx={FX} cy={FY + 19} rx={5} ry={7} />
    </>
  ),
  wink: (
    <>
      <circle cx={FX - EYE_DX} cy={EYE_Y} r={4.5} />
      {arcEye(FX + EYE_DX, true)}
      <path d={smile} {...line} />
    </>
  ),
  sad: (
    <>
      {dots(4.5)}
      <path d={`M${FX - 10} ${FY + 22} Q${FX} ${FY + 13} ${FX + 10} ${FY + 22}`} {...line} />
    </>
  ),
}

export const Face = ({ id, ink }: { id: FaceId; ink: string }) => (
  <g fill={ink} stroke={ink}>
    {FACE_PARTS[id]}
  </g>
)

const GOLD = '#FFD54A'

const sparkle = (x: number, y: number, size: number, delay: string) => (
  <path
    key={`${x}-${y}`}
    className="avatar-sparkle"
    style={{ animationDelay: delay }}
    d={`M${x} ${y - size} Q${x} ${y} ${x + size} ${y} Q${x} ${y} ${x} ${y + size} Q${x} ${y} ${x - size} ${y} Q${x} ${y} ${x} ${y - size} Z`}
    fill={GOLD}
  />
)

/** Hats hang off `topY` (the highest point of the current head); the rest are fixed to the canvas. */
export const Accessory = ({ id, topY, ink }: { id: AccessoryId; topY: number; ink: string }) => {
  switch (id) {
    case 'crown':
      return (
        <path
          transform={`translate(${FX} ${topY + 5})`}
          d="M-22 0 L-24 -22 L-11 -11 L0 -26 L11 -11 L24 -22 L22 0 Z"
          fill={GOLD}
          stroke="#B8860B"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      )
    case 'bow':
      return (
        <g transform={`translate(${FX + 22} ${topY + 8}) rotate(14)`} fill="#FE2A3B">
          <path d="M0 0 L-20 -12 L-20 12 Z M0 0 L20 -12 L20 12 Z" />
          <circle r={5.5} />
        </g>
      )
    case 'flower':
      return (
        <g transform={`translate(${FX + 20} ${topY + 6})`}>
          {[0, 72, 144, 216, 288].map((angle) => (
            <circle
              key={angle}
              cx={9 * Math.cos((angle * Math.PI) / 180)}
              cy={9 * Math.sin((angle * Math.PI) / 180)}
              r={7.5}
              fill="#FEA7A9"
              stroke="#F87C64"
              strokeWidth={1}
            />
          ))}
          <circle r={5} fill={GOLD} />
        </g>
      )
    case 'glasses':
      return (
        <g fill="none" stroke={ink} strokeWidth={3}>
          <circle cx={FX - 16} cy={FY - 2} r={12} />
          <circle cx={FX + 16} cy={FY - 2} r={12} />
          <path d={`M${FX - 4} ${FY - 2} H${FX + 4}`} strokeLinecap="round" />
        </g>
      )
    case 'blush':
      return (
        <g fill="#FE2A3B" opacity={0.35}>
          <circle cx={FX - 32} cy={FY + 12} r={7} />
          <circle cx={FX + 32} cy={FY + 12} r={7} />
        </g>
      )
    case 'scarf':
      return (
        <path
          d="M62 124 Q100 146 138 124 L144 142 Q100 164 56 142 Z"
          fill="#B7EA15"
          stroke="#7A9C00"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      )
    case 'hands':
      return (
        <g fill="#FDFCF9" stroke="#141413" strokeWidth={2.5}>
          <ellipse cx={80} cy={170} rx={15} ry={12} />
          <ellipse cx={120} cy={170} rx={15} ry={12} />
        </g>
      )
    case 'sparkles':
      return (
        <g>
          {sparkle(26, 56, 12, '0s')}
          {sparkle(176, 100, 9, '-0.6s')}
          {sparkle(32, 176, 8, '-1.2s')}
        </g>
      )
  }
}
