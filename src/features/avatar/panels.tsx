import { WORD_CARDS } from '@/features/word-field/bodyWordsData'
import { wordColor, wordPath } from '@/features/word-field/helpers/shapes'
import { ACCESSORIES, BODIES, BODY_COLORS, FACES } from '@/entities/avatar/catalog'
import {
  ACCESSORY_IDS,
  BODY_COLOR_IDS,
  BODY_IDS,
  FACE_IDS,
  type AccessoryId,
  type AvatarConfig,
  type BodyColorId,
  type BodyId,
  type FaceId,
} from '@/entities/avatar/types'
import { AvatarCharacter } from './AvatarCharacter'
import { OptionButton } from './OptionButton'
import './panels.css'

/** Each picker tile is the character itself with that one option applied, so
 * previews can never drift from what the option really looks like. */
const preview = (avatar: AvatarConfig, change: Partial<AvatarConfig>) => (
  <AvatarCharacter config={{ ...avatar, ...change }} />
)

export const FeelingPanel = ({
  avatar,
  latestWordId,
  onPick,
}: {
  avatar: AvatarConfig
  /** word from the latest check-in, offered as a one-tap shortcut */
  latestWordId: string | null
  onPick: (wordId: string) => void
}) => {
  const latest = latestWordId ? WORD_CARDS.find((card) => card.id === latestWordId) : undefined
  return (
    <div className="avatar-panel">
      {latest && latest.id !== avatar.headWordId && (
        <button type="button" className="avatar-panel__shortcut" onClick={() => onPick(latest.id)}>
          Use my latest feeling: {latest.word}
        </button>
      )}
      <div className="avatar-panel__grid avatar-panel__grid--feelings">
        {WORD_CARDS.map((card) => (
          <OptionButton
            key={card.id}
            label={card.word}
            selected={card.id === avatar.headWordId}
            onSelect={() => onPick(card.id)}
          >
            <svg viewBox="0 0 100 100">
              <path d={wordPath(card.id, false)} fill={wordColor(card.id)} />
            </svg>
          </OptionButton>
        ))}
      </div>
    </div>
  )
}

export const BodyPanel = ({
  avatar,
  onPickBody,
  onPickColor,
}: {
  avatar: AvatarConfig
  onPickBody: (id: BodyId) => void
  onPickColor: (id: BodyColorId) => void
}) => (
  <div className="avatar-panel">
    <div className="avatar-panel__grid">
      {BODY_IDS.map((id) => (
        <OptionButton key={id} label={BODIES[id].label} selected={id === avatar.bodyId} onSelect={() => onPickBody(id)}>
          {preview(avatar, { bodyId: id })}
        </OptionButton>
      ))}
    </div>
    <div className="avatar-panel__swatches" role="group" aria-label="Body colour">
      {BODY_COLOR_IDS.map((id) => (
        <button
          key={id}
          type="button"
          className={`avatar-swatch${id === avatar.bodyColor ? ' avatar-swatch--selected' : ''}`}
          style={{ background: BODY_COLORS[id].hex }}
          aria-label={BODY_COLORS[id].label}
          aria-pressed={id === avatar.bodyColor}
          onClick={() => onPickColor(id)}
        />
      ))}
    </div>
  </div>
)

export const FacePanel = ({ avatar, onPick }: { avatar: AvatarConfig; onPick: (id: FaceId) => void }) => (
  <div className="avatar-panel">
    <div className="avatar-panel__grid">
      {FACE_IDS.map((id) => (
        <OptionButton key={id} label={FACES[id].label} selected={id === avatar.faceId} onSelect={() => onPick(id)}>
          {preview(avatar, { faceId: id })}
        </OptionButton>
      ))}
    </div>
  </div>
)

export const ExtrasPanel = ({
  avatar,
  onToggle,
}: {
  avatar: AvatarConfig
  onToggle: (id: AccessoryId) => void
}) => (
  <div className="avatar-panel">
    <div className="avatar-panel__grid">
      {ACCESSORY_IDS.map((id) => (
        <OptionButton
          key={id}
          label={ACCESSORIES[id].label}
          selected={avatar.accessoryIds.includes(id)}
          onSelect={() => onToggle(id)}
        >
          {preview({ ...avatar, accessoryIds: [] }, { accessoryIds: [id] })}
        </OptionButton>
      ))}
    </div>
  </div>
)
