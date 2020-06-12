import '../../setup.js'
import * as dsp from '../../fixtures/dsp.js'
import Context from '../../../js/loop-script/context.js'

const workerFactory = () => {
  const worker = new Worker('/js/loop-script/worker.js', { type: 'module' })
  worker.onerror = console.dir
  return worker
}

const contextFactory = (filename, name, channels = 1, length = 44100) => {
  const output = Array(channels).fill().map(() => new Float32Array(length))

  const context = new Context({
    filename,
    method: { name, type: dsp[name].constructor.name },
    output,
    length,
    lengths: {
      bar: length,
      beat: length
    }
  })

  return context
}

const dspRender = async (fn, channels, length, start = 0) => {
  if (fn.constructor.name === 'AsyncFunction') fn = await fn()
  const output = Array(channels).fill().map(() => new Float32Array(length))
  for (let n = 0; n < length; n++) {
    let sample = fn({ valueOf: () => (1 + start + n) / length, n })
    for (let channel = 0; channel < output.length; channel++) {
      output[channel][n] = Array.isArray(sample) ? sample[channel] : sample
    }
  }
  return output
}

describe("new Worker", () => {
  it("should create a Worker", () => {
    const worker = workerFactory()
    expect(worker).to.be.instanceof(Worker)
    worker.terminate()
  })
})

describe('run for "sine"', () => {
  let context, worker, expected

  before(async () => {
    context = contextFactory('/test/fixtures/dsp.js', 'sine', 1, 10)
    worker = workerFactory()
    expected = await dspRender(dsp.sine, 1, 10)
  })

  after(() => {
    worker.terminate()
  })

  it('should post "setup" and receive response', async () => {
    const response = await new Promise(resolve => {
      worker.addEventListener('message', ({ data }) => resolve(data), { once: true })
      worker.postMessage({ type: 'setup', context })
    })
    expect(response.type).to.equal('setup')
    expect(response.context).to.deep.equal(context)
    context.put(response.context)
  })

  it('should post "testFirstSample" and receive response', async () => {
    const response = await new Promise(resolve => {
      worker.addEventListener('message', ({ data }) => resolve(data), { once: true })
      worker.postMessage({ type: 'testFirstSample', context })
    })
    expect(response.type).to.equal('setup')
    expect(response.context).to.not.deep.equal(context)
    expect(response.context.firstSample).to.be.a('number')
    expect(response.context.firstSample).to.not.equal(0)
    context.put(response.context)
  })

  it('should post "render" and receive response', async () => {
    const response = await new Promise(resolve => {
      worker.addEventListener('message', ({ data }) => resolve(data), { once: true })
      worker.postMessage({ type: 'render', context })
    })
    expect(response.type).to.equal('render')
    expect(response.context).to.not.deep.equal(context)
    expect(response.context.firstSample).to.not.be.a('number')
    expect(response.context.output[0]).to.be.buffer(expected[0])
    expect(response.context.n).to.equal(10)
  })
})

describe('run for "setupSine"', () => {
  let context, worker, expected

  before(async () => {
    context = contextFactory('/test/fixtures/dsp.js', 'setupSine', 1, 10)
    worker = workerFactory()
    expected = await dspRender(dsp.setupSine, 1, 10)
  })

  after(() => {
    worker.terminate()
  })

  it('should post "setup" and receive response', async () => {
    const response = await new Promise(resolve => {
      worker.addEventListener('message', ({ data }) => resolve(data), { once: true })
      worker.postMessage({ type: 'setup', context })
    })
    expect(response.type).to.equal('setup')
    expect(response.context).to.not.deep.equal(context)
    expect(response.context.meta.setupStartTime).to.be.a('number')
    expect(response.context.meta.setupDuration).to.be.a('number')
    context.put(response.context)
  })

  it('should post "testFirstSample" and receive response', async () => {
    const response = await new Promise(resolve => {
      worker.addEventListener('message', ({ data }) => resolve(data), { once: true })
      worker.postMessage({ type: 'testFirstSample', context })
    })
    expect(response.type).to.equal('setup')
    expect(response.context).to.not.deep.equal(context)
    expect(response.context.firstSample).to.be.a('number')
    expect(response.context.firstSample).to.not.equal(0)
    context.put(response.context)
  })

  it('should post "render" and receive response', async () => {
    const response = await new Promise(resolve => {
      worker.addEventListener('message', ({ data }) => resolve(data), { once: true })
      worker.postMessage({ type: 'render', context })
    })
    expect(response.type).to.equal('render')
    expect(response.context).to.not.deep.equal(context)
    expect(response.context.firstSample).to.not.be.a('number')
    expect(response.context.output[0]).to.be.buffer(expected[0])
    expect(response.context.n).to.equal(10)
  })
})

describe('run for "stereoSine"', () => {
  let context, worker, expected

  before(async () => {
    context = contextFactory('/test/fixtures/dsp.js', 'stereoSine', 2, 10)
    worker = workerFactory()
    expected = await dspRender(dsp.stereoSine, 2, 10)
  })

  after(() => {
    worker.terminate()
  })

  it('should post "setup" and receive response', async () => {
    const response = await new Promise(resolve => {
      worker.addEventListener('message', ({ data }) => resolve(data), { once: true })
      worker.postMessage({ type: 'setup', context })
    })
    expect(response.type).to.equal('setup')
    expect(response.context).to.deep.equal(context)
    context.put(response.context)
  })

  it('should post "testFirstSample" and receive response', async () => {
    const response = await new Promise(resolve => {
      worker.addEventListener('message', ({ data }) => resolve(data), { once: true })
      worker.postMessage({ type: 'testFirstSample', context })
    })
    expect(response.type).to.equal('setup')
    expect(response.context).to.not.deep.equal(context)
    expect(response.context.firstSample).to.be.an('array')
    expect(response.context.firstSample[0]).to.not.equal(0)
    context.put(response.context)
  })

  it('should post "render" and receive response', async () => {
    const response = await new Promise(resolve => {
      worker.addEventListener('message', ({ data }) => resolve(data), { once: true })
      worker.postMessage({ type: 'render', context })
    })
    expect(response.type).to.equal('render')
    expect(response.context).to.not.deep.equal(context)
    expect(response.context.firstSample).to.not.be.a('number')
    expect(response.context.output[0]).to.be.buffer(expected[0])
    expect(response.context.output[1]).to.be.buffer(expected[1])
    expect(response.context.n).to.equal(10)
  })
})
