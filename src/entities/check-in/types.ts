export type BodyZone =
  | 'head'
  | 'neck'
  | 'pelvic'
  | 'trapLeft'
  | 'trapRight'
  | 'shoulderLeft'
  | 'shoulderRight'
  | 'upperArmLeft'
  | 'upperArmRight'
  | 'elbowLeft'
  | 'elbowRight'
  | 'forearmLeft'
  | 'forearmRight'
  | 'wristLeft'
  | 'wristRight'
  | 'handLeft'
  | 'handRight'
  | 'chestLeft'
  | 'chestRight'
  | 'ribsLeft'
  | 'ribsRight'
  | 'absLeft'
  | 'absRight'
  | 'upperBackLeft'
  | 'upperBackRight'
  | 'midBackLeft'
  | 'midBackRight'
  | 'lowerBackLeft'
  | 'lowerBackRight'
  | 'hipLeft'
  | 'hipRight'
  | 'gluteLeft'
  | 'gluteRight'
  | 'quadLeft'
  | 'quadRight'
  | 'hamstringLeft'
  | 'hamstringRight'
  | 'kneeLeft'
  | 'kneeRight'
  | 'shinLeft'
  | 'shinRight'
  | 'calfLeft'
  | 'calfRight'
  | 'ankleLeft'
  | 'ankleRight'
  | 'footLeft'
  | 'footRight'
  | 'heelLeft'
  | 'heelRight'
  /** not localized to one body part — for words like "foggy" or "dizzy" */
  | 'whole'

/** How big the feeling is for this specific check-in — independent of
 * WordCard.intensity, which just shapes the word's default card art. */
export type CheckInIntensity = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

/** Slider starts here so a user who never touches it still has a valid answer
 * and can move on — picking a value is optional, not a required interaction. */
export const DEFAULT_CHECK_IN_INTENSITY: CheckInIntensity = 5

export type Energy = 'low' | 'medium' | 'high'

export interface NewCheckInEntry {
  /** references WordCard.id from word-field/bodyWordsData — content isn't duplicated here */
  wordId: string
  bodyZone: BodyZone
  intensity: CheckInIntensity
  energy?: Energy
  note?: string
}

export interface CheckInEntry extends NewCheckInEntry {
  id: string
  /** local calendar day, 'YYYY-MM-DD' — for grouping entries by day */
  date: string
  /** ISO datetime — for ordering entries within a day */
  createdAt: string
}
