import DynamicCache from '../../js/dynamic-cache.js'

describe("DynamicCache.install()", () => {
  let serviceWorker

  it("should install the service worker", async () => {
    serviceWorker = await DynamicCache.install()
    expect(serviceWorker.state).to.equal('activated')
  })

  it("should return the same worker when run twice", async () => {
    const newServiceWorker = await DynamicCache.install()
    expect(newServiceWorker).to.equal(serviceWorker)
  })
})

describe("new DynamicCache(namespace, headers)", () => {
  it("should create a new DynamicCache namespace", () => {
    const cache = new DynamicCache('foo')
    expect(cache).to.be.instanceof(DynamicCache)
    expect(cache.namespace).to.equal('foo')
    expect(cache.path).to.equal('/dynamic-cache/cache/foo')
  })

  it("should use provided headers", () => {
    const headers = { 'Content-Type': 'application/json' }
    const cache = new DynamicCache('foo', headers)
    expect(cache).to.be.instanceof(DynamicCache)
    expect(cache.headers).to.deep.equal(headers)
  })
})

describe("cache.put(filename, contents)", () => {
  let a, b

  before(async () => {
    a = new DynamicCache('aaa', { 'Content-Type': 'application/json' })
    b = new DynamicCache('bbb', { 'Content-Type': 'application/json' })
  })

  it("should create a cache entry", async () => {
    await a.put('foo', 'bar')
    const result = await fetch(`${a.path}/foo`).then(res => res.text())
    expect(result).to.equal('bar')
  })

  it("should update the cache entry", async () => {
    await a.put('foo', 'zoo')
    const result = await fetch(`${a.path}/foo`).then(res => res.text())
    expect(result).to.equal('zoo')
  })

  it("should use different namespaces", async () => {
    try {
      await fetch(`${b.path}/foo`)
    } catch (error) {
      expect(error.message).to.include('Failed to fetch')
    }

    let result
    await b.put('foo', 'bbb')
    result = await fetch(`${b.path}/foo`).then(res => res.text())
    expect(result).to.equal('bbb')
    result = await fetch(`${a.path}/foo`).then(res => res.text())
    expect(result).to.equal('zoo')
  })
})
