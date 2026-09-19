import { WORD_CARDS } from '@/features/word-field/bodyWordsData'
import { wordColor, wordLabelColor, wordPath } from '@/features/word-field/helpers/shapes'
import { ACCESSORIES } from '@/entities/avatar/catalog'
import { FALLBACK_HEAD_WORD_ID } from '@/entities/avatar/avatarModel'
import type { AvatarConfig } from '@/entities/avatar/types'
import { headTopY, headTransform } from './headGeometry'
import { BEHIND_HEAD } from './layers'
import { Accessory, Body, Face } from './parts'
import './AvatarCharacter.css'

const describe = (avatar: AvatarConfig, word: string): string => {
  const worn = avatar.accessoryIds.map((id) => ACCESSORIES[id].label.toLowerCase())
  return `Your character, feeling ${word}${worn.length ? `, wearing ${worn.join(', ')}` : ''}`
}

/** The character: a body, with the chosen feeling's shape as its head. Pure
 * function of `config`, so the same component draws the big stage and every
 * picker thumbnail. */
export const AvatarCharacter = ({
  config,
  animated = false,
  className,
}: {
  config: AvatarConfig
  animated?: boolean
  className?: string
}) => {
  // a stored word that no longer exists still renders — it just borrows the default head
  const headWordId = WORD_CARDS.some((card) => card.id === config.headWordId)
    ? config.headWordId
    : FALLBACK_HEAD_WORD_ID
  const word = WORD_CARDS.find((card) => card.id === headWordId)!.word
  const ink = wordLabelColor(headWordId)
  const topY = headTopY(headWordId)
  const behind = config.accessoryIds.filter((id) => BEHIND_HEAD.includes(id))
  const inFront = config.accessoryIds.filter((id) => !BEHIND_HEAD.includes(id))

  return (
    <svg
      viewBox="0 0 200 260"
      className={`avatar-character${animated ? ' avatar-character--animated' : ''}${className ? ` ${className}` : ''}`}
      role="img"
      aria-label={describe(config, word)}
    >
      <g className="avatar-character__bob">
        <Body id={config.bodyId} color={config.bodyColor} />
        {behind.map((id) => (
          <Accessory key={id} id={id} topY={topY} ink={ink} />
        ))}
        <path
          d={wordPath(headWordId, false)}
          transform={headTransform}
          fill={wordColor(headWordId)}
          stroke="#FDFCF9"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <Face id={config.faceId} ink={ink} />
        {inFront.map((id) => (
          <Accessory key={id} id={id} topY={topY} ink={ink} />
        ))}
      </g>
    </svg>
  )
}
