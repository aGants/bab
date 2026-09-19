import type { HatId } from './hatCatalog'
import { WornHat } from './hats'

/** The character's head and face, drawn on the head's own 199.856×125.697
 * canvas — the same coordinates whether it's part of the full character or the
 * small mascot in the header. */
export const CloudHead = () => (
  <>
    <path
      fill="#FFA7AA"
      d="M174.876 125.697H34.0198C34.0198 125.697 0 125.776 0 98.0046C0 77.0323 16.8749 64.7436 29.0929 64.4842C29.738 64.4706 30.1365 63.7007 29.7609 63.1762C20.0395 49.6028 19.5048 27.1768 34.0198 18.1016C57.7099 3.28965 71.2395 18.9743 76.9643 32.3537C77.303 33.1454 78.9028 32.8794 78.9624 32.0204C79.8963 18.5589 85.8139 5.20762e-05 107.006 3.05176e-05C129.239 7.8993e-06 133.824 19.9065 132.51 33.1684C132.428 33.9972 133.715 34.4856 134.178 33.7931C139.734 25.4769 148.83 15.8625 166.643 25.2618C184.717 34.7981 178.038 57.0202 170.876 67.6001C170.533 68.1065 170.893 68.8084 171.504 68.8253C183.475 69.1563 199.856 75.144 199.856 98.0046C199.856 116.362 188.196 125.697 174.876 125.697Z"
    />
    <HeadFace />
  </>
)

/** The face on its own, so a head that isn't the cloud (a feeling's shape) can
 * wear the same one. The cheeks sit out at the cloud's edges, so narrower
 * shapes leave them off. */
export const HeadFace = ({ cheeks = true }: { cheeks?: boolean }) => (
  <>
    <ellipse fill="#fff" cx="74.1592" cy="72.6378" rx="13.9923" ry="14.1044" />
    <ellipse fill="#000" cx="78.59" cy="72.6378" rx="9.56139" ry="9.63802" />
    <ellipse fill="#fff" cx="121.733" cy="72.6378" rx="13.9923" ry="14.1044" />
    <ellipse fill="#000" cx="126.164" cy="72.6378" rx="9.56139" ry="9.63802" />
    <path
      fill="none"
      stroke="#000"
      strokeWidth="2.95513"
      d="M106.341 86.7422C106.341 91.481 102.53 95.3224 97.8294 95.3224C93.1283 95.3224 89.3174 91.481 89.3174 86.7422"
    />
    {cheeks && (
      <>
        <ellipse fill="#FF2A3B" cx="50.9553" cy="95.3224" rx="10.844" ry="10.9309" />
        <ellipse fill="#FF2A3B" cx="144.937" cy="95.3224" rx="10.844" ry="10.9309" />
      </>
    )}
  </>
)

// where a hat sits on the cloud: centred, resting a little below the top bumps
const HAT_X = 100
const HAT_REST_Y = 32
const HAT_WIDTH = 122

/** A hat on the head, in the head's coordinates. It sticks out above the canvas. */
export const HeadHat = ({ id }: { id: HatId }) => (
  <WornHat id={id} x={HAT_X} restY={HAT_REST_Y} width={HAT_WIDTH} />
)

/** The head on its own as a small icon (the header mascot). The svg doesn't
 * clip, so a hat can rise above the box without changing its size. */
export const HeadMascot = ({
  hatId,
  width,
  height,
  className,
}: {
  hatId: HatId | null
  width: number
  height: number
  className?: string
}) => (
  <svg
    viewBox="0 0 199.856 125.697"
    width={width}
    height={height}
    className={className}
    style={{ overflow: 'visible' }}
    aria-hidden="true"
    focusable="false"
  >
    <CloudHead />
    {hatId && <HeadHat id={hatId} />}
  </svg>
)
