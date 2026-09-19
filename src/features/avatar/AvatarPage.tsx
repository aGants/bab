import { useState } from 'react'
import { Trans } from '@lingui/react/macro'
import type { HatId } from '@/entities/avatar/hatCatalog'
import { useHeadWord } from '@/entities/avatar/headWord'
import { useWornHat } from '@/entities/avatar/wornHat'
import { PageFrame } from '@/shared/layout'
import { Button, Greeting, TabBar } from '@/shared/ui'
import { AccessoryPicker } from './AccessoryPicker'
import { WorldCharacter } from './WorldCharacter'
import './AvatarPage.css'

export const AvatarPage = () => {
  const { hatId: savedHatId, saveHat } = useWornHat()
  const { headWordId } = useHeadWord()
  // what's being tried on: shown on the big character right away, but only
  // reaches the header and storage once Customize is pressed
  const [draftHatId, setDraftHatId] = useState<HatId | null>(savedHatId)
  const toggleDraftHat = (id: HatId) => setDraftHatId((current) => (current === id ? null : id))
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
          <WorldCharacter hatId={draftHatId} headWordId={headWordId ?? undefined} animated className="avatar-page__character" />
        </div>

        <AccessoryPicker hatId={draftHatId} onToggleHat={toggleDraftHat} />

        <Button onClick={() => saveHat(draftHatId)}>
          <Trans>Customize</Trans>
        </Button>
      </div>
      <TabBar />
    </PageFrame>
  )
}
