export const ROUTES = {
  checkIn: '/',
  words: '/words',
  checkInFlow: '/words/:wordId/check-in',
  calendar: '/calendar',
} as const

export const checkInFlowPath = (wordId: string): string => `/words/${wordId}/check-in`
