import { Trans } from '@lingui/react/macro'
import { PageFrame } from '@/shared/layout'
import { Button, Greeting, TabBar } from '@/shared/ui'
import { AccessoryPicker } from './AccessoryPicker'
import { useWornHat } from './useWornHat'
import { WorldCharacter } from './WorldCharacter'
import './AvatarPage.css'

export const AvatarPage = () => {
  const { hatId, toggleHat } = useWornHat()
  return (
    <PageFrame>
      <Greeting />
      <div className="avatar-page__content">
        <h1 className="avatar-page__title">
          <Trans>What’s new?</Trans>
        </h1>

        <div className="avatar-page__switch">
          <button type="button" className="avatar-page__switch-option avatar-page__switch-option--active" aria-pressed>
            <Trans>Avatar</Trans>
          </button>
          {/* not built yet: dimmed so it reads as unavailable */}
          <button type="button" className="avatar-page__switch-option" aria-pressed={false} disabled>
            <Trans>Stickers</Trans>
          </button>
        </div>

        <div className="avatar-page__stage">
          <WorldCharacter hatId={hatId} animated className="avatar-page__character" />
        </div>

        <AccessoryPicker hatId={hatId} onToggleHat={toggleHat} />

        <Button>
          <Trans>Customize</Trans>
        </Button>
      </div>
      <TabBar />
    </PageFrame>
  )
}
