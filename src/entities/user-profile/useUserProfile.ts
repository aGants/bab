import { useEffect, useState } from 'react'
import { DEFAULT_NAME, userProfileRepository } from './userProfileRepository'
import type { UserProfile } from './types'

type Listener = (profile: UserProfile) => void

/** Every mounted useUserProfile, so a name saved on the Settings page shows up
 * in the header Greeting straight away instead of after a reload. */
const listeners = new Set<Listener>()

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile>({ name: DEFAULT_NAME })

  useEffect(() => {
    userProfileRepository.get().then(setProfile)
    listeners.add(setProfile)
    return () => {
      listeners.delete(setProfile)
    }
  }, [])

  const setName = async (name: string) => {
    const next = await userProfileRepository.setName(name)
    listeners.forEach((listener) => listener(next))
  }

  return {
    name: profile.name,
    setName,
  }
}
