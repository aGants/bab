import { useUserProfile } from '@/entities/user-profile/useUserProfile'
import { DEFAULT_NAME } from '@/entities/user-profile/userProfileRepository'
import './Greeting.css'
import { SensationIcon } from './SensationIcon'

export const Greeting = () => {
  const { name } = useUserProfile()
  return (
    <div className="app-greeting app-greeting--home">
      <p className="app-greeting-text">
        Hi, {name.trim() || DEFAULT_NAME}
      </p>
      <span className="app-greeting-icon">
        <SensationIcon />
      </span>
    </div>
  )
}
