/** `crypto.randomUUID` only exists in secure contexts (https / localhost) and iOS 15.4+ —
 * opening the dev server on a phone over plain http://<lan-ip> leaves it undefined and
 * anything calling it throws. `getRandomValues` is available everywhere, so fall back to it. */
export const createId = (): string => {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()

  const bytes = crypto.getRandomValues(new Uint8Array(16))
  // RFC 4122 v4: version nibble = 4, variant bits = 10xx
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}
