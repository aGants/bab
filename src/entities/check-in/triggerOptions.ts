import type { MessageDescriptor } from '@lingui/core'
import { msg } from '@lingui/core/macro'
import type { Trigger } from './types'

export const TRIGGER_OPTIONS: { value: Trigger; label: MessageDescriptor }[] = [
  { value: 'movement', label: msg`When I move it` },
  { value: 'pressure', label: msg`When I press it` },
  { value: 'stillness', label: msg`Standing still` },
]
