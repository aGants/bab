import { useLingui } from '@lingui/react/macro'
import { CloudHead, HeadFace, HeadHat } from '@/entities/avatar/CloudHead'
import { HAT_LABELS, type HatId } from '@/entities/avatar/hatCatalog'
import { wordColor, wordPath } from '@/entities/word'
import { WORD_CARDS } from '@/i18n'
import './AvatarCharacter.css'

// A feeling's shape stands in for the cloud on the same canvas. Word shapes are
// drawn in a 100×100 box but fill it very unevenly (a bolt is narrow, a puddle
// low), so each is fitted by its own bounds: its longer side matches the
// cloud's height, it's centred over the cloud and rests on the body like the
// cloud does. The face was drawn for the 200-wide cloud, so it shrinks with the
// shape's width and sits on its centre.
const HEAD_FIT = 125
const HEAD_CENTER_X = 100
const HEAD_BASE_Y = 122
const FACE_CENTER = { x: 98, y: 82 } as const
const FACE_WIDTH = 76
const FACE_SHARE = 0.55

const pathBounds = (path: string) => {
  const numbers = path.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? []
  const xs = numbers.filter((_, i) => i % 2 === 0)
  const ys = numbers.filter((_, i) => i % 2 === 1)
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) }
}

const WordHead = ({ wordId }: { wordId: string }) => {
  const path = wordPath(wordId, false)
  const { minX, maxX, minY, maxY } = pathBounds(path)
  const scale = HEAD_FIT / Math.max(maxX - minX, maxY - minY)
  const x = HEAD_CENTER_X - ((minX + maxX) / 2) * scale
  const y = HEAD_BASE_Y - maxY * scale
  const centerY = y + ((minY + maxY) / 2) * scale
  const faceScale = (FACE_SHARE * (maxX - minX) * scale) / FACE_WIDTH
  return (
    <>
      <path d={path} transform={`translate(${x} ${y}) scale(${scale})`} fill={wordColor(wordId)} />
      <g
        transform={`translate(${HEAD_CENTER_X - FACE_CENTER.x * faceScale} ${centerY - FACE_CENTER.y * faceScale}) scale(${faceScale})`}
      >
        <HeadFace cheeks={false} />
      </g>
    </>
  )
}

/** The character from the World design: cloud head with its face, red arch
 * body, and hands held to the chest. Drawn on the design's own 199.856×302
 * canvas so it scales as one piece. A hat can stick out above the canvas
 * (the svg doesn't clip). `headWordId` swaps the cloud for that feeling's
 * shape; the cloud is what it wears otherwise. */
export const WorldCharacter = ({
  hatId = null,
  headWordId,
  animated = false,
  className,
}: {
  hatId?: HatId | null
  headWordId?: string
  animated?: boolean
  className?: string
}) => {
  const { t, i18n } = useLingui()
  const hat = hatId ? i18n._(HAT_LABELS[hatId]).toLocaleLowerCase(i18n.locale) : null
  // a stored word that no longer exists just gets the cloud
  const headCard = WORD_CARDS.find((card) => card.id === headWordId)
  const word = headCard?.word
  const description = word
    ? t`Your character, feeling ${word}`
    : hat
      ? t`Your character, wearing a ${hat}`
      : t`Your character`
  return (
    <svg
      viewBox="0 0 199.856 302"
      className={`avatar-character${animated ? ' avatar-character--animated' : ''}${className ? ` ${className}` : ''}`}
      role="img"
      aria-label={description}
    >
      <g className="avatar-character__bob">
        {/* body: legs, then torso over them */}
        <path
          fill="#FF383C"
          d="M100.426 181.582C119.642 181.582 136.087 187.061 149.08 197.532C161.69 207.694 169.14 221.014 173.653 233.681C182.363 258.132 182.117 286.381 182.117 302H131.407C131.407 284.72 131.161 265.211 125.787 250.127C123.258 243.028 120.145 238.636 116.911 236.029C114.059 233.731 109.378 231.383 100.426 231.383C91.4732 231.383 85.7511 233.754 81.6478 236.754C77.2334 239.981 73.2299 245.042 69.8706 252.258C62.899 267.233 60.8033 286.911 60.8033 302H10.0927C10.0927 284.191 12.318 256.11 23.7514 231.551C29.5945 219 38.3146 206.35 51.3651 196.808C64.7266 187.039 81.2108 181.582 100.426 181.582Z"
        />
        <rect fill="#FF383C" x="9.79467" y="122.432" width="180.967" height="107.974" rx="45" />

        {headCard ? <WordHead wordId={headCard.id} /> : <CloudHead />}

        {/* hands on the chest */}
        <g fill="none" stroke="#000" strokeWidth="2.03165">
          <path d="M44.4433 173.84L59.1125 163.812C64.9893 159.642 75.9361 150.592 79.4625 155.75C82.9888 160.909 74.7906 167.048 71.6793 171.622C75.6164 167.669 85.4508 163.171 88.616 167.613C91.7811 172.056 82.5219 178.202 77.4966 180.719C82.0701 178.128 92.0078 174.102 95.1709 178.73C97.1684 181.652 89.0797 188.249 79.9612 194.311C74.6406 197.849 65.292 204.339 65.292 204.339" />
          <path d="M152.659 173.84L137.99 163.812C132.113 159.642 121.166 150.592 117.64 155.75C114.113 160.909 122.312 167.048 125.423 171.622C121.486 167.669 111.651 163.171 108.486 167.613C105.321 172.056 114.58 178.202 119.606 180.719C115.032 178.128 105.094 174.102 101.931 178.73C99.9338 181.652 108.022 188.249 117.141 194.311C122.462 197.849 131.81 204.339 131.81 204.339" />
        </g>

        {hatId && !headCard && <HeadHat id={hatId} />}
      </g>
    </svg>
  )
}
