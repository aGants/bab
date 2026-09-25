/** The parts of the (non-standard) Network Information API this needs; Safari doesn't have it at all. */
type Connection = { saveData?: boolean; effectiveType?: string }

/** True when the visitor asked their browser to save data, or is on a very slow connection: work nobody
 * is waiting for, like fetching screens they may never open, should be skipped. Unknown counts as fine. */
export const isDataSaverOn = (): boolean => {
  const connection = (navigator as Navigator & { connection?: Connection }).connection
  return connection?.saveData === true || connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g'
}
