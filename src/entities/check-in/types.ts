export type BodyZone =
  | 'head'
  | 'neck'
  | 'shoulderLeft'
  | 'shoulderRight'
  | 'chest'
  | 'upperBack'
  | 'lowerBack'
  | 'abdomen'
  | 'armLeft'
  | 'armRight'
  | 'handLeft'
  | 'handRight'
  | 'hipLeft'
  | 'hipRight'
  | 'thighLeft'
  | 'thighRight'
  | 'kneeLeft'
  | 'kneeRight'
  | 'calfLeft'
  | 'calfRight'
  | 'ankleLeft'
  | 'ankleRight'
  | 'footLeft'
  | 'footRight'
  /** not localized to one body part — for words like "foggy" or "dizzy" */
  | 'whole'

/** How big the feeling is for this specific check-in — independent of
 * WordCard.intensity, which just shapes the word's default card art. */
export type CheckInIntensity = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export interface NewCheckInEntry {
  /** references WordCard.id from word-field/bodyWordsData — content isn't duplicated here */
  wordId: string
  bodyZone: BodyZone
  intensity: CheckInIntensity
  note?: string
}

export interface CheckInEntry extends NewCheckInEntry {
  id: string
  /** local calendar day, 'YYYY-MM-DD' — for grouping entries by day */
  date: string
  /** ISO datetime — for ordering entries within a day */
  createdAt: string
}
