/** Registers the offline/installability service worker (public/sw.js).
 * Prod only: in dev it would cache Vite's modules and hide code changes. */
export const registerServiceWorker = (): void => {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Service worker registration failed', error)
    })
  })
}
