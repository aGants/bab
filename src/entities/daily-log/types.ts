export interface DailyLog {
  /** local calendar day, 'YYYY-MM-DD' — one record per day, shared across
   * every check-in made that day */
  date: string
  /** null = never answered for this day, distinct from an explicit "no" */
  hadPeriod: boolean | null
  tookPainkiller: boolean | null
}
