import type { ReactNode } from 'react'
import { HAT_BOX, HAT_REST_Y, type HatId } from './hatCatalog'

const BUCKET_GREEN = '#B7E915'
const BUCKET_GREEN_DARK = '#9BC80D'
const BEANIE_RED = '#FF383C'
const BEANIE_RED_DARK = '#D92A30'
const CAP_LILAC = '#C9B8F7'
const CAP_LILAC_DARK = '#AC98EA'
const BERET_PINK = '#F58C9A'
const BERET_STEM = '#D9606E'
const FEDORA_GREEN = '#0B5450'
const FEDORA_GREEN_DARK = '#073D3A'
const FEDORA_BAND = '#F1E6C8'

const HAT_ART: Record<HatId, ReactNode> = {
  bucket: (
    <>
      <path d="M23 36 Q24 11 50 11 Q76 11 77 36 Z" fill={BUCKET_GREEN} />
      <path
        d="M6 45 Q8 34 24 32 L76 32 Q92 34 94 45 Q72 56 50 56 Q28 56 6 45 Z"
        fill={BUCKET_GREEN_DARK}
      />
      <path d="M23 36 Q50 42 77 36 L76 32 L24 32 Z" fill={BUCKET_GREEN} />
      {[0, 72, 144, 216, 288].map((angle) => (
        <circle
          key={angle}
          cx={34 + 4.2 * Math.cos((angle * Math.PI) / 180)}
          cy={38 + 4.2 * Math.sin((angle * Math.PI) / 180)}
          r={3.2}
          fill="#fff"
        />
      ))}
      <circle cx={34} cy={38} r={2.4} fill="#141413" />
    </>
  ),
  beanie: (
    <>
      <circle cx={50} cy={11} r={7} fill={BEANIE_RED} />
      <path d="M24 42 Q22 15 50 15 Q78 15 76 42 Z" fill={BEANIE_RED} />
      <rect x={21} y={38} width={58} height={13} rx={4} fill={BEANIE_RED_DARK} />
      <path
        d="M30 39v11M38 39v11M46 39v11M54 39v11M62 39v11M70 39v11"
        stroke={BEANIE_RED}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </>
  ),
  cap: (
    <>
      <path d="M28 46 Q26 13 56 13 Q80 15 80 46 Z" fill={CAP_LILAC} />
      <path d="M80 46 Q80 46 28 46 Q10 46 4 54 Q22 57 40 52 Z" fill={CAP_LILAC_DARK} />
      <circle cx={60} cy={28} r={6} fill={FEDORA_GREEN} />
    </>
  ),
  beret: (
    <>
      <path
        d="M50 22 L52 10"
        stroke={BERET_STEM}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M12 40 Q12 21 50 20 Q88 21 88 40 Q88 51 50 51 Q12 51 12 40 Z"
        fill={BERET_PINK}
      />
    </>
  ),
  fedora: (
    <>
      <path d="M31 38 Q31 11 50 11 Q69 11 69 38 Z" fill={FEDORA_GREEN} />
      <path d="M31 38 Q50 41 69 38 L69.5 32 Q50 35 30.5 32 Z" fill={FEDORA_BAND} />
      <ellipse cx={50} cy={40} rx={46} ry={11} fill={FEDORA_GREEN_DARK} />
      <path d="M31 38 Q50 41 69 38 L69 40 Q50 44 31 40 Z" fill={FEDORA_GREEN} />
    </>
  ),
}

/** The hat as a standalone thumbnail. */
export const HatThumbnail = ({ id }: { id: HatId }) => (
  <svg viewBox={`0 0 ${HAT_BOX.width} ${HAT_BOX.height}`} aria-hidden="true" focusable="false">
    {HAT_ART[id]}
  </svg>
)

/** The hat placed on a parent svg's canvas: `x` is its horizontal centre and
 * `restY` the head line it sits on, `width` how wide the 100-unit box is drawn. */
export const WornHat = ({ id, x, restY, width }: { id: HatId; x: number; restY: number; width: number }) => {
  const scale = width / HAT_BOX.width
  return (
    <g transform={`translate(${x - (HAT_BOX.width / 2) * scale} ${restY - HAT_REST_Y * scale}) scale(${scale})`}>
      {HAT_ART[id]}
    </g>
  )
}
