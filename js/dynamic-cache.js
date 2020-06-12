export default class DynamicCache {
  static async cleanup () {
    const cacheKeys = await window.caches.keys()
    await Promise.all(cacheKeys
      .filter(key => key.startsWith('dynamic-cache:'))
      .map(key => window.caches.delete(key))
    )
  }

  static install () {
    return new Promise(async resolve => {
      await DynamicCache.cleanup()

      const reg = await navigator
        .serviceWorker
        .register('/dynamic-cache-service-worker.js', { scope: '/' })

      if (reg.active) return resolve(reg.active)

      reg.onupdatefound = () => {
        reg.installing.onstatechange = event => {
          if (event.target.state === 'activated') {
            resolve(event.target)
          }
        }
      }

      reg.update()
    })
  }

  constructor (namespace, headers) {
    this.namespace = namespace
    this.headers = headers
    this.path = '/dynamic-cache/cache/' + this.namespace
  }

  async put (filename, content, headers = this.headers) {
    filename = `${this.path}/${filename}`
    const req = new Request(filename, { method: 'GET', headers })
    const res = new Response(content, { status: 200, headers })
    const cache = await caches.open('dynamic-cache:' + this.namespace)
    await cache.put(req, res)
    return filename
  }
}
