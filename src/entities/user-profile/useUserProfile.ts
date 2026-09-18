import { useEffect, useState } from 'react'
import { DEFAULT_NAME, userProfileRepository } from './userProfileRepository'
import type { UserProfile } from './types'

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile>({ name: DEFAULT_NAME })

  useEffect(() => {
    userProfileRepository.get().then(setProfile)
  }, [])

  const setName = async (name: string) => {
    setProfile(await userProfileRepository.setName(name))
  }

  return {
    name: profile.name,
    setName,
  }
}
