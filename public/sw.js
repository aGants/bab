const CACHE = 'app-v2'
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/favicon.png', '/icon-192.png', '/icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

const cachePut = async (request, response) => {
  if (response.ok || response.type === 'opaque') {
    const cache = await caches.open(CACHE)
    await cache.put(request, response.clone())
  }
  return response
}

// Pages: network first so a new deploy shows up, cached shell when offline (SPA fallback).
const handleNavigation = async (request) => {
  try {
    return await cachePut('/index.html', await fetch(request))
  } catch {
    return (await caches.match('/index.html')) ?? Response.error()
  }
}

// Hashed build assets never change: cache first. Everything else (fonts, images): serve cached, refresh in background.
const handleAsset = async (request) => {
  const cached = await caches.match(request)
  if (cached && new URL(request.url).pathname.startsWith('/assets/')) return cached
  const refresh = fetch(request).then((response) => cachePut(request, response))
  if (!cached) return refresh
  // background refresh only: offline it just fails quietly, the cached copy was already served
  refresh.catch(() => {})
  return cached
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request))
  } else if (url.origin === self.location.origin || url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com')) {
    event.respondWith(handleAsset(request))
  }
})
