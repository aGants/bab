import { Trans, useLingui } from '@lingui/react/macro'
import { wordColor, wordPath } from '@/entities/word'
import { WORD_CARDS } from '@/i18n'
import { BODY_COLORS } from '@/entities/avatar/catalog'
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
import { ACCESSORY_LABELS, BODY_COLOR_LABELS, BODY_LABELS, FACE_LABELS } from './labels'
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
  const latestName = latest?.word
  return (
    <div className="avatar-panel">
      {latest && latest.id !== avatar.headWordId && (
        <button type="button" className="avatar-panel__shortcut" onClick={() => onPick(latest.id)}>
          <Trans>Use my latest feeling: {latestName}</Trans>
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
}) => {
  const { t, i18n } = useLingui()
  return (
    <div className="avatar-panel">
      <div className="avatar-panel__grid">
        {BODY_IDS.map((id) => (
          <OptionButton
            key={id}
            label={i18n._(BODY_LABELS[id])}
            selected={id === avatar.bodyId}
            onSelect={() => onPickBody(id)}
          >
            {preview(avatar, { bodyId: id })}
          </OptionButton>
        ))}
      </div>
      <div className="avatar-panel__swatches" role="group" aria-label={t`Body colour`}>
        {BODY_COLOR_IDS.map((id) => (
          <button
            key={id}
            type="button"
            className={`avatar-swatch${id === avatar.bodyColor ? ' avatar-swatch--selected' : ''}`}
            style={{ background: BODY_COLORS[id].hex }}
            aria-label={i18n._(BODY_COLOR_LABELS[id])}
            aria-pressed={id === avatar.bodyColor}
            onClick={() => onPickColor(id)}
          />
        ))}
      </div>
    </div>
  )
}

export const FacePanel = ({ avatar, onPick }: { avatar: AvatarConfig; onPick: (id: FaceId) => void }) => {
  const { i18n } = useLingui()
  return (
    <div className="avatar-panel">
      <div className="avatar-panel__grid">
        {FACE_IDS.map((id) => (
          <OptionButton
            key={id}
            label={i18n._(FACE_LABELS[id])}
            selected={id === avatar.faceId}
            onSelect={() => onPick(id)}
          >
            {preview(avatar, { faceId: id })}
          </OptionButton>
        ))}
      </div>
    </div>
  )
}

export const ExtrasPanel = ({
  avatar,
  onToggle,
}: {
  avatar: AvatarConfig
  onToggle: (id: AccessoryId) => void
}) => {
  const { i18n } = useLingui()
  return (
    <div className="avatar-panel">
      <div className="avatar-panel__grid">
        {ACCESSORY_IDS.map((id) => (
          <OptionButton
            key={id}
            label={i18n._(ACCESSORY_LABELS[id])}
            selected={avatar.accessoryIds.includes(id)}
            onSelect={() => onToggle(id)}
          >
            {preview({ ...avatar, accessoryIds: [] }, { accessoryIds: [id] })}
          </OptionButton>
        ))}
      </div>
    </div>
  )
}
