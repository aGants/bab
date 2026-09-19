import { useEffect, useRef, useState } from 'react'
import { avatarRepository } from './avatarRepository'
import { defaultAvatar, toggleAccessory } from './avatarModel'
import type { AccessoryId, AvatarConfig, BodyColorId, BodyId, FaceId } from './types'

/** The character being edited. Until the user changes something nothing is
 * stored, and the head just follows `fallbackHeadWordId` (their latest
 * feeling); the first change pins the whole config. Every change persists
 * immediately, so leaving the page never loses an edit. */
export const useAvatar = (fallbackHeadWordId: string) => {
  const [saved, setSaved] = useState<AvatarConfig | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    avatarRepository.get().then((stored) => {
      if (cancelled) return
      setSaved(stored)
      setLoaded(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const avatar = saved ?? defaultAvatar(fallbackHeadWordId)

  // Edits are computed from the latest value rather than the render's closure,
  // so two quick taps in a row both land.
  const latest = useRef(avatar)
  useEffect(() => {
    latest.current = avatar
  })

  const apply = (change: (current: AvatarConfig) => AvatarConfig) => {
    const next = change(latest.current)
    latest.current = next
    setSaved(next)
    void avatarRepository.save(next)
  }

  return {
    avatar,
    loaded,
    setHead: (headWordId: string) => apply((current) => ({ ...current, headWordId })),
    setBody: (bodyId: BodyId) => apply((current) => ({ ...current, bodyId })),
    setBodyColor: (bodyColor: BodyColorId) => apply((current) => ({ ...current, bodyColor })),
    setFace: (faceId: FaceId) => apply((current) => ({ ...current, faceId })),
    toggleAccessory: (id: AccessoryId) => apply((current) => toggleAccessory(current, id)),
    /** Back to the plain character, keeping the feeling currently on its head. */
    reset: () => apply((current) => defaultAvatar(current.headWordId)),
  }
}
