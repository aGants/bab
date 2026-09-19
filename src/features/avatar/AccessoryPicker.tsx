import type { ReactNode } from 'react'
import { Trans, useLingui } from '@lingui/react/macro'
import { HAT_IDS, HAT_LABELS, type HatId } from './hatCatalog'
import { HatThumbnail } from './hats'
import './AccessoryPicker.css'

const ICON_PROPS = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

const HatIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="M6.5 15.5C6.5 9 8.5 6.5 12 6.5s5.5 2.5 5.5 9" />
    <path d="M2.5 16.5c0-1 2.5-1.5 9.5-1.5s9.5.5 9.5 1.5-2.5 2-9.5 2-9.5-1-9.5-2Z" />
  </svg>
)

const NecklaceIcon = () => (
  <svg {...ICON_PROPS} fill="currentColor" stroke="none">
    <circle cx="4.5" cy="4.5" r="1.3" />
    <circle cx="5.5" cy="9" r="1.3" />
    <circle cx="8" cy="13" r="1.3" />
    <circle cx="12" cy="15" r="1.3" />
    <circle cx="16" cy="13" r="1.3" />
    <circle cx="18.5" cy="9" r="1.3" />
    <circle cx="19.5" cy="4.5" r="1.3" />
    <circle cx="12" cy="19" r="2" />
  </svg>
)

const ShoeIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="M3 17.5V14l5-1 2.5 2.5h3c3.5 0 6 1.5 7.5 3v2H3Z" />
    <path d="M3 17.5h18" />
    <path d="M8 13l1.5-3.5" />
  </svg>
)

type Category = { id: string; label: ReactNode; icon: ReactNode; available: boolean }

/** Category pills over a grid of hats. Only hats exist so far — the other
 * pills are shown dimmed and can't be picked. */
export const AccessoryPicker = ({
  hatId,
  onToggleHat,
}: {
  hatId: HatId | null
  onToggleHat: (id: HatId) => void
}) => {
  const { t, i18n } = useLingui()
  const categories: Category[] = [
    { id: 'hat', label: <Trans>Hat</Trans>, icon: <HatIcon />, available: true },
    { id: 'necklace', label: <Trans>Necklace</Trans>, icon: <NecklaceIcon />, available: false },
    { id: 'shoes', label: <Trans>Shoes</Trans>, icon: <ShoeIcon />, available: false },
  ]

  return (
    <div className="accessory-picker">
      <div className="accessory-picker__categories">
        {categories.map(({ id, label, icon, available }) => (
          <button
            key={id}
            type="button"
            className={`accessory-picker__category${available ? ' accessory-picker__category--active' : ''}`}
            aria-pressed={available}
            disabled={!available}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      <div className="accessory-picker__items" role="group" aria-label={t`Hats`}>
        {HAT_IDS.map((id) => (
          <button
            key={id}
            type="button"
            className={`accessory-picker__item${hatId === id ? ' accessory-picker__item--selected' : ''}`}
            aria-pressed={hatId === id}
            aria-label={i18n._(HAT_LABELS[id])}
            onClick={() => onToggleHat(id)}
          >
            <HatThumbnail id={id} />
          </button>
        ))}
      </div>
    </div>
  )
}
