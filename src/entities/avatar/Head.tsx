import type { ReactNode } from 'react'
import { wordColor } from '@/entities/word'
import { CloudHead, HeadFace, HeadHat } from './CloudHead'
import type { HatId } from './hatCatalog'
import { WornHat } from './hats'
import { isWordId } from './headWord'
import { wordHeadLayout } from './headLayout'

/** The character's head on its canvas: the cloud, or the shape of the feeling
 * `wordId` (an unknown word is the cloud too), with the face and the hat on it.
 * Pass the hat here so it sits right on whichever head is worn. `hatClassName`
 * goes on a group around the hat, keyed by hat so a swap remounts it (that's
 * what lets a CSS animation replay when another hat goes on). */
export const Head = ({
  wordId,
  hatId,
  hatClassName,
}: {
  wordId?: string | null
  hatId?: HatId | null
  hatClassName?: string
}) => {
  if (!isWordId(wordId)) {
    return (
      <>
        <CloudHead />
        {hatId && (
          <g key={hatId} className={hatClassName}>
            <HeadHat id={hatId} />
          </g>
        )}
      </>
    )
  }
  const { path, headTransform, faceTransform, hat } = wordHeadLayout(wordId)
  return (
    <>
      <path d={path} transform={headTransform} fill={wordColor(wordId)} />
      <g transform={faceTransform}>
        <HeadFace cheeks={false} />
      </g>
      {hatId && (
        <g key={hatId} className={hatClassName}>
          <WornHat id={hatId} {...hat} />
        </g>
      )}
    </>
  )
}

/** The head on its own as a small icon (the header mascot). The svg doesn't
 * clip, so a hat can rise above the box without changing its size. */
export const HeadMascot = ({
  hatId,
  wordId,
  width,
  height,
  className,
}: {
  hatId: HatId | null
  wordId?: string | null
  width: number
  height: number
  className?: string
}): ReactNode => (
  <svg
    viewBox="0 0 199.856 125.697"
    width={width}
    height={height}
    className={className}
    style={{ overflow: 'visible' }}
    aria-hidden="true"
    focusable="false"
  >
    <Head wordId={wordId} hatId={hatId} />
  </svg>
)
