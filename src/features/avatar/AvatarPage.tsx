import { useEffect, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import type { HatId } from '@/entities/avatar/hatCatalog'
import { useHeadWord } from '@/entities/avatar/headWord'
import type { BodyColorId } from '@/entities/avatar/types'
import { useWornHat } from '@/entities/avatar/wornHat'
import { useWornBodyColor } from '@/entities/avatar/worldBodyColor'
import { PageFrame } from '@/shared/layout'
import { Button, Greeting, TabBar, useComingSoon } from '@/shared/ui'
import { AccessoryPicker } from './AccessoryPicker'
import { BodyColorPicker } from './BodyColorPicker'
import { WorldCharacter } from './WorldCharacter'
import './AvatarPage.css'

const SAVED_FEEDBACK_MS = 2000

export const AvatarPage = () => {
  const { hatId: savedHatId, saveHat } = useWornHat()
  const { bodyColorId: savedBodyColorId, saveBodyColor } = useWornBodyColor()
  const { headWordId } = useHeadWord()
  const { comingSoonNotice, showComingSoon } = useComingSoon()
  // what's being tried on: shown on the big character right away, but only
  // reaches the header and storage once Customize is pressed
  const [draftHatId, setDraftHatId] = useState<HatId | null>(savedHatId)
  const [draftBodyColorId, setDraftBodyColorId] = useState<BodyColorId>(savedBodyColorId)
  // brief confirmation after Customize: the button turns into a check and the
  // character hops; trying on another hat ends it early
  const [justSaved, setJustSaved] = useState(false)
  useEffect(() => {
    if (!justSaved) return
    const timer = window.setTimeout(() => setJustSaved(false), SAVED_FEEDBACK_MS)
    return () => window.clearTimeout(timer)
  }, [justSaved])
  // a hat already saved shouldn't drop in again on opening the page
  const [triedOn, setTriedOn] = useState(false)
  const toggleDraftHat = (id: HatId) => {
    setJustSaved(false)
    setTriedOn(true)
    setDraftHatId((current) => (current === id ? null : id))
  }
  const pickBodyColor = (id: BodyColorId) => {
    setJustSaved(false)
    setDraftBodyColorId(id)
  }
  const save = () => {
    saveHat(draftHatId)
    saveBodyColor(draftBodyColorId)
    setJustSaved(true)
  }
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
          {/* not built yet: dimmed, and tapping says so (aria-disabled, not disabled, or a tap never fires) */}
          <button
            type="button"
            className="avatar-page__switch-option avatar-page__switch-option--soon"
            aria-pressed={false}
            aria-disabled
            onClick={showComingSoon}
          >
            <Trans>Stickers</Trans>
          </button>
        </div>

        <div className={justSaved ? 'avatar-page__stage avatar-page__stage--saved' : 'avatar-page__stage'}>
          <WorldCharacter hatId={draftHatId} bodyColorId={draftBodyColorId} headWordId={headWordId ?? undefined} animated hatEntrance={triedOn} className="avatar-page__character" />
        </div>

        <BodyColorPicker bodyColorId={draftBodyColorId} onPick={pickBodyColor} />

        <AccessoryPicker hatId={draftHatId} onToggleHat={toggleDraftHat} onUnavailable={showComingSoon} />

        <Button onClick={save} data-saved={justSaved || undefined}>
          {justSaved ? (
            <>
              <svg className="avatar-page__check" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
              <Trans>Saved</Trans>
            </>
          ) : (
            <Trans>Customize</Trans>
          )}
        </Button>
      </div>
      {comingSoonNotice}
      <TabBar />
    </PageFrame>
  )
}
