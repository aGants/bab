import type { Messages } from '../../types'
import { bodyZones } from './bodyZones'
import { errorScreen } from './errorScreen'
import { vas } from './vas'
import { categories, words } from './words'

export const it: Messages = { words, categories, vas, bodyZones, errorScreen }
