import { useUserProfile } from '@/entities/user-profile/useUserProfile'
import './Greeting.css'

export const Greeting = () => {
  const { name } = useUserProfile()
  return <p className="app-greeting">Hi, {name}</p>
}
