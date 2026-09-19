import { useLingui } from '@lingui/react/macro'
import { HAT_LABELS, type HatId } from './hatCatalog'
import { WornHat } from './hats'
import './AvatarCharacter.css'

// where a hat sits on the cloud head: centred, resting a little below the top bumps
const HAT_X = 100
const HAT_REST_Y = 32
const HAT_WIDTH = 122

/** The character from the World design: cloud head with its face, red arch
 * body, and hands held to the chest. Drawn on the design's own 199.856×302
 * canvas so it scales as one piece. A hat can stick out above the canvas
 * (the svg doesn't clip). */
export const WorldCharacter = ({
  hatId = null,
  animated = false,
  className,
}: {
  hatId?: HatId | null
  animated?: boolean
  className?: string
}) => {
  const { t, i18n } = useLingui()
  const hat = hatId ? i18n._(HAT_LABELS[hatId]).toLocaleLowerCase(i18n.locale) : null
  return (
    <svg
      viewBox="0 0 199.856 302"
      className={`avatar-character${animated ? ' avatar-character--animated' : ''}${className ? ` ${className}` : ''}`}
      role="img"
      aria-label={hat ? t`Your character, wearing a ${hat}` : t`Your character`}
    >
      <g className="avatar-character__bob">
        {/* body: legs, then torso over them */}
        <path
          fill="#FF383C"
          d="M100.426 181.582C119.642 181.582 136.087 187.061 149.08 197.532C161.69 207.694 169.14 221.014 173.653 233.681C182.363 258.132 182.117 286.381 182.117 302H131.407C131.407 284.72 131.161 265.211 125.787 250.127C123.258 243.028 120.145 238.636 116.911 236.029C114.059 233.731 109.378 231.383 100.426 231.383C91.4732 231.383 85.7511 233.754 81.6478 236.754C77.2334 239.981 73.2299 245.042 69.8706 252.258C62.899 267.233 60.8033 286.911 60.8033 302H10.0927C10.0927 284.191 12.318 256.11 23.7514 231.551C29.5945 219 38.3146 206.35 51.3651 196.808C64.7266 187.039 81.2108 181.582 100.426 181.582Z"
        />
        <rect fill="#FF383C" x="9.79467" y="122.432" width="180.967" height="107.974" rx="45" />

        {/* head */}
        <path
          fill="#FFA7AA"
          d="M174.876 125.697H34.0198C34.0198 125.697 0 125.776 0 98.0046C0 77.0323 16.8749 64.7436 29.0929 64.4842C29.738 64.4706 30.1365 63.7007 29.7609 63.1762C20.0395 49.6028 19.5048 27.1768 34.0198 18.1016C57.7099 3.28965 71.2395 18.9743 76.9643 32.3537C77.303 33.1454 78.9028 32.8794 78.9624 32.0204C79.8963 18.5589 85.8139 5.20762e-05 107.006 3.05176e-05C129.239 7.8993e-06 133.824 19.9065 132.51 33.1684C132.428 33.9972 133.715 34.4856 134.178 33.7931C139.734 25.4769 148.83 15.8625 166.643 25.2618C184.717 34.7981 178.038 57.0202 170.876 67.6001C170.533 68.1065 170.893 68.8084 171.504 68.8253C183.475 69.1563 199.856 75.144 199.856 98.0046C199.856 116.362 188.196 125.697 174.876 125.697Z"
        />

        {/* face */}
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
        <ellipse fill="#FF2A3B" cx="50.9553" cy="95.3224" rx="10.844" ry="10.9309" />
        <ellipse fill="#FF2A3B" cx="144.937" cy="95.3224" rx="10.844" ry="10.9309" />

        {/* hands on the chest */}
        <g fill="none" stroke="#000" strokeWidth="2.03165">
          <path d="M44.4433 173.84L59.1125 163.812C64.9893 159.642 75.9361 150.592 79.4625 155.75C82.9888 160.909 74.7906 167.048 71.6793 171.622C75.6164 167.669 85.4508 163.171 88.616 167.613C91.7811 172.056 82.5219 178.202 77.4966 180.719C82.0701 178.128 92.0078 174.102 95.1709 178.73C97.1684 181.652 89.0797 188.249 79.9612 194.311C74.6406 197.849 65.292 204.339 65.292 204.339" />
          <path d="M152.659 173.84L137.99 163.812C132.113 159.642 121.166 150.592 117.64 155.75C114.113 160.909 122.312 167.048 125.423 171.622C121.486 167.669 111.651 163.171 108.486 167.613C105.321 172.056 114.58 178.202 119.606 180.719C115.032 178.128 105.094 174.102 101.931 178.73C99.9338 181.652 108.022 188.249 117.141 194.311C122.462 197.849 131.81 204.339 131.81 204.339" />
        </g>

        {hatId && <WornHat id={hatId} x={HAT_X} restY={HAT_REST_Y} width={HAT_WIDTH} />}
      </g>
    </svg>
  )
}
