import { useUserProfile } from '@/entities/user-profile/useUserProfile'
import { DEFAULT_NAME } from '@/entities/user-profile/userProfileRepository'
import './Greeting.css'
import { SensationIcon } from './SensationIcon'

type GreetingProps = {
  variant?: 'default' | 'home'
}

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours()

  if (hour < 5) return 'Good night'
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export const Greeting = ({ variant = 'default' }: GreetingProps) => {
  const { name } = useUserProfile()
  const className =
    variant === 'home' ? 'app-greeting app-greeting--home' : 'app-greeting'
  return (
    <div className={className}>
      <p className="app-greeting-text">
        {getTimeBasedGreeting()}, {name.trim() || DEFAULT_NAME}
      </p>
      <span className="app-greeting-icon">
        <SensationIcon />
      </span>
    </div>
  )
}
