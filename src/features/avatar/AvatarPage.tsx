import { useState } from 'react'
import { msg } from '@lingui/core/macro'
import { Trans, useLingui } from '@lingui/react/macro'
import { useContent } from '@/i18n'
import { FALLBACK_HEAD_WORD_ID } from '@/entities/avatar/avatarModel'
import { useAvatar } from '@/entities/avatar/useAvatar'
import { PageFrame } from '@/shared/layout'
import { Greeting, TabBar } from '@/shared/ui'
import { AvatarCharacter } from './AvatarCharacter'
import { BodyPanel, ExtrasPanel, FacePanel, FeelingPanel } from './panels'
import { useLatestFeeling } from './useLatestFeeling'
import './AvatarPage.css'

const TABS = [
  { id: 'feeling', label: msg`Feeling` },
  { id: 'body', label: msg`Body` },
  { id: 'face', label: msg`Face` },
  { id: 'extras', label: msg`Extras` },
] as const

type TabId = (typeof TABS)[number]['id']

export const AvatarPage = () => {
  const { t, i18n } = useLingui()
  const { wordCards } = useContent()
  const latest = useLatestFeeling()
  const { avatar, loaded, setHead, setBody, setBodyColor, setFace, toggleAccessory, reset } = useAvatar(
    latest.wordId ?? FALLBACK_HEAD_WORD_ID,
  )
  const [tab, setTab] = useState<TabId>('feeling')

  // wait for both stores so the character doesn't flash the wrong head first
  const ready = loaded && latest.loaded
  const feeling = wordCards.find((card) => card.id === avatar.headWordId)
  const feelingName = feeling?.word

  return (
    <PageFrame>
      <Greeting />
      {ready && (
        <>
          <div className="avatar-page__stage">
            <AvatarCharacter config={avatar} animated className="avatar-page__character" />
            {feeling && (
              <p className="avatar-page__feeling">
                <Trans>Feeling {feelingName}</Trans>
              </p>
            )}
          </div>

          <div className="avatar-page__editor">
            <div className="avatar-page__tabs" role="tablist" aria-label={t`Customize`}>
              {TABS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  id={`avatar-tab-${id}`}
                  aria-selected={tab === id}
                  aria-controls="avatar-tabpanel"
                  className={`avatar-page__tab${tab === id ? ' avatar-page__tab--active' : ''}`}
                  onClick={() => setTab(id)}
                >
                  {i18n._(label)}
                </button>
              ))}
            </div>

            <div
              className="avatar-page__panel"
              role="tabpanel"
              id="avatar-tabpanel"
              aria-labelledby={`avatar-tab-${tab}`}
            >
              {tab === 'feeling' && (
                <FeelingPanel avatar={avatar} latestWordId={latest.wordId} onPick={setHead} />
              )}
              {tab === 'body' && (
                <BodyPanel avatar={avatar} onPickBody={setBody} onPickColor={setBodyColor} />
              )}
              {tab === 'face' && <FacePanel avatar={avatar} onPick={setFace} />}
              {tab === 'extras' && <ExtrasPanel avatar={avatar} onToggle={toggleAccessory} />}
              <button type="button" className="avatar-page__reset" onClick={reset}>
                <Trans>Reset character</Trans>
              </button>
            </div>
          </div>
        </>
      )}
      <TabBar />
    </PageFrame>
  )
}
