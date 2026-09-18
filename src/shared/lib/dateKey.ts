/** Local calendar day as 'YYYY-MM-DD' — never toISOString(), which is UTC and
 * can roll the date over near midnight in the user's own timezone. */
export const toDateKey = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const todayKey = (): string => toDateKey(new Date())
