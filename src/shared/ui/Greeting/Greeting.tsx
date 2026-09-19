import { Trans } from '@lingui/react/macro'
import { useUserProfile } from '@/entities/user-profile/useUserProfile'
import { DEFAULT_NAME } from '@/entities/user-profile/userProfileRepository'
import cloud from './assets/cloud.svg'
import cloudSmall from './assets/cloud-small.svg'
import './Greeting.css'

export const Greeting = ({ welcome = false }: { welcome?: boolean }) => {
  const { name } = useUserProfile()
  const displayName = name.trim() || DEFAULT_NAME

  if (welcome) {
    return (
      <div className="app-greeting app-greeting--welcome">
        <div className="app-greeting-copy">
          <p className="app-greeting-hello">
            <Trans>Good morning,</Trans>
          </p>
          <p className="app-greeting-name">{displayName}</p>
        </div>
        <img className="app-greeting-cloud" src={cloud} width={68} height={43} alt="" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className="app-greeting">
      <p className="app-greeting-text">
        <Trans>Good morning, {displayName}</Trans>
      </p>
      <img className="app-greeting-cloud" src={cloudSmall} width={39} height={24.529} alt="" aria-hidden="true" />
    </div>
  )
}
