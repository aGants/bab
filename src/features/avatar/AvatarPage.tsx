import { Trans, useLingui } from '@lingui/react/macro'
import { PageFrame } from '@/shared/layout'
import { Button, Greeting, TabBar } from '@/shared/ui'
import accessories from './assets/accessories.png'
import { WorldCharacter } from './WorldCharacter'
import './AvatarPage.css'

export const AvatarPage = () => {
  const { t } = useLingui()
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
          {/* not built yet */}
          <button type="button" className="avatar-page__switch-option" aria-pressed={false} disabled>
            <Trans>Stickers</Trans>
          </button>
        </div>

        <div className="avatar-page__stage">
          <WorldCharacter animated className="avatar-page__character" />
        </div>

        {/* placeholder for the accessory picker until it's built */}
        <div className="avatar-page__accessories">
          <img src={accessories} alt={t`Accessories: hats, necklaces and shoes`} />
        </div>

        <Button>
          <Trans>Customize</Trans>
        </Button>
      </div>
      <TabBar />
    </PageFrame>
  )
}
