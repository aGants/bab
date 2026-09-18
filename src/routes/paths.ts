export const ROUTES = {
  checkIn: '/',
  words: '/words',
  checkInFlow: '/words/:wordId/check-in',
  calendar: '/calendar',
  settings: '/settings',
} as const

export const checkInFlowPath = (wordId: string): string => `/words/${wordId}/check-in`
