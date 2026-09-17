export const ROUTES = {
  checkIn: '/',
  words: '/words',
  checkInFlow: '/words/:wordId/check-in',
} as const

export const checkInFlowPath = (wordId: string): string => `/words/${wordId}/check-in`
