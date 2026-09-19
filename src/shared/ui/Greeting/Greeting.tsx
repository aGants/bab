import { Trans } from '@lingui/react/macro'
import { HeadMascot } from '@/entities/avatar/CloudHead'
import { useWornHat } from '@/entities/avatar/wornHat'
import { useUserProfile } from '@/entities/user-profile/useUserProfile'
import { DEFAULT_NAME } from '@/entities/user-profile/userProfileRepository'
import './Greeting.css'

export const Greeting = ({ welcome = false }: { welcome?: boolean }) => {
  const { name } = useUserProfile()
  const displayName = name.trim() || DEFAULT_NAME
  const { hatId } = useWornHat()

  if (welcome) {
    return (
      <div className="app-greeting app-greeting--welcome">
        <div className="app-greeting-copy">
          <p className="app-greeting-hello">
            <Trans>Hi,</Trans>
          </p>
          <p className="app-greeting-name">{displayName}</p>
        </div>
        <HeadMascot className="app-greeting-cloud" hatId={hatId} width={68} height={43} />
      </div>
    )
  }

  return (
    <div className="app-greeting">
      <p className="app-greeting-text">
        <Trans>Hi, {displayName}</Trans>
      </p>
      <HeadMascot className="app-greeting-cloud" hatId={hatId} width={39} height={24.529} />
    </div>
  )
}
