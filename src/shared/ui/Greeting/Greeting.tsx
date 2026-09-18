import { useUserProfile } from '@/entities/user-profile/useUserProfile'
import './Greeting.css'

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
    <p className={className}>
      {getTimeBasedGreeting()}, {name}
    </p>
  )
}
