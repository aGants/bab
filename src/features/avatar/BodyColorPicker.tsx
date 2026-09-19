import { useLingui } from '@lingui/react/macro'
import { BODY_COLOR_IDS, type BodyColorId } from '@/entities/avatar/types'
import { WORLD_BODY_COLORS } from '@/entities/avatar/worldBodyColor'
import { BODY_COLOR_LABELS } from './labels'
import './BodyColorPicker.css'

/** A row of colour dots for the character's body. */
export const BodyColorPicker = ({
  bodyColorId,
  onPick,
}: {
  bodyColorId: BodyColorId
  onPick: (id: BodyColorId) => void
}) => {
  const { t, i18n } = useLingui()
  return (
    <div className="body-color-picker" role="group" aria-label={t`Body colour`}>
      {BODY_COLOR_IDS.map((id) => (
        <button
          key={id}
          type="button"
          className={`body-color-picker__swatch${id === bodyColorId ? ' body-color-picker__swatch--selected' : ''}`}
          style={{ background: WORLD_BODY_COLORS[id] }}
          aria-label={i18n._(BODY_COLOR_LABELS[id])}
          aria-pressed={id === bodyColorId}
          onClick={() => onPick(id)}
        />
      ))}
    </div>
  )
}
