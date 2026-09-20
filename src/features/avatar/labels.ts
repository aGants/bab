import type { MessageDescriptor } from '@lingui/core'
import { msg } from '@lingui/core/macro'
import type { BodyColorId } from '@/entities/avatar/types'

// Picker labels for the avatar's body colours. The colours themselves live in
// entities/avatar; the wording lives here so it can be translated.

export const BODY_COLOR_LABELS: Record<BodyColorId, MessageDescriptor> = {
  coral: msg`Coral`,
  teal: msg`Teal`,
  lime: msg`Lime`,
  pink: msg`Pink`,
  lavender: msg`Lavender`,
  red: msg`Red`,
}
