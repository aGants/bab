import { Trans, useLingui } from '@lingui/react/macro'
import { HeadMascot } from '@/entities/avatar/Head'
import { useHeadWord } from '@/entities/avatar/headWord'
import { useWornHat } from '@/entities/avatar/wornHat'
import { useUserProfile } from '@/entities/user-profile/useUserProfile'
import './Greeting.css'

// one mascot size for both greeting layouts, so the bar is the same height everywhere
const MASCOT_WIDTH = 80
const MASCOT_HEIGHT = 50.3

export const Greeting = ({ welcome = false }: { welcome?: boolean }) => {
  const { t } = useLingui()
  const { name } = useUserProfile()
  const displayName =
    name.trim() ||
    t({ message: 'Girl', comment: 'Friendly name the greeting uses until the user enters their own' })
  const { hatId } = useWornHat()
  const { headWordId } = useHeadWord()

  if (welcome) {
    return (
      <div className="app-greeting app-greeting--welcome">
        <div className="app-greeting-copy">
          <p className="app-greeting-hello">
            <Trans>Hi,</Trans>
          </p>
          <p className="app-greeting-name">{displayName}</p>
        </div>
        <HeadMascot className="app-greeting-cloud" hatId={hatId} wordId={headWordId} width={MASCOT_WIDTH} height={MASCOT_HEIGHT} />
      </div>
    )
  }

  return (
    <div className="app-greeting">
      <p className="app-greeting-text">
        <Trans>Hi, {displayName}</Trans>
      </p>
      <HeadMascot className="app-greeting-cloud" hatId={hatId} wordId={headWordId} width={MASCOT_WIDTH} height={MASCOT_HEIGHT} />
    </div>
  )
}
