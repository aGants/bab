import { WORDS } from '@/entities/word'
import { createStoredChoice } from './storedChoice'

export const isWordId = (value: unknown): value is string =>
  typeof value === 'string' && WORDS.some((word) => word.id === value)

const head = createStoredChoice('world-head-word', isWordId)

/** The feeling the character wears as its head — the one from the user's last
 * check-in — or null before there is one, when it wears the cloud. A stored
 * word that no longer exists reads as null too. */
export const useHeadWord = () => ({ headWordId: head.useValue(), saveHeadWord: head.save })
