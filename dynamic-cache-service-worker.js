self.skipWaiting()
self.addEventListener('activate', () => {
  clients.claim()
  self.registration.unregister()
})
self.addEventListener('fetch', event => {
  const pathname = new URL(event.request.url).pathname
  if (!pathname.startsWith('/dynamic-cache/cache/')) return
  event.respondWith(async function () {
    const namespace = pathname.split('/dynamic-cache/cache/')[1].split('/')[0] // /dynamic-cache/<namespace>/foo
    const cache = await caches.open('dynamic-cache:' + namespace)
    const response = await cache.match(event.request)
    return response ?? fetch(event.request, { mode: 'same-origin', cache: 'only-if-cached' })
  }())
})
