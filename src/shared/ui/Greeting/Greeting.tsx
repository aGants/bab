import { useUserProfile } from '@/entities/user-profile/useUserProfile'
import './Greeting.css'

type GreetingProps = {
  variant?: 'default' | 'home'
}

export const Greeting = ({ variant = 'default' }: GreetingProps) => {
  const { name } = useUserProfile()
  const className =
    variant === 'home' ? 'app-greeting app-greeting--home' : 'app-greeting'
  return <p className={className}>Hi, {name}</p>
}
