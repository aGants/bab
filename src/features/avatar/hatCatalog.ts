import type { MessageDescriptor } from '@lingui/core'
import { msg } from '@lingui/core/macro'

export const HAT_IDS = ['bucket', 'beanie', 'cap', 'beret', 'fedora'] as const
export type HatId = (typeof HAT_IDS)[number]

export const isHatId = (value: unknown): value is HatId =>
  typeof value === 'string' && (HAT_IDS as readonly string[]).includes(value)

/** Every hat is drawn in the same 100×60 box, with the line it rests on the
 * head at y = HAT_REST_Y. That shared frame is what lets one drawing serve as
 * the picker thumbnail and as the hat on the character. */
export const HAT_BOX = { width: 100, height: 60 } as const
export const HAT_REST_Y = 50

export const HAT_LABELS: Record<HatId, MessageDescriptor> = {
  bucket: msg`Bucket hat`,
  beanie: msg`Beanie`,
  cap: msg`Cap`,
  beret: msg`Beret`,
  fedora: msg`Wide-brim hat`,
}
