import '../../setup.js'
import LoopScriptNode from '../../../js/loop-script/node.js'

describe("start + pause", () => {
  let node, context, recorder, record, rendered, initSource

  before(async () => {
    context = new AudioContext({ numberOfChannels: 1, sampleRate: 44100 })
  })

  beforeEach(async () => {
    node = new LoopScriptNode('/test/fixtures/dsp.js', { name: 'ones' })
    await context.audioWorklet.addModule('/test/worklet-recorder.js')
    recorder = new AudioWorkletNode(context, 'recorder')
    recorder.connect(context.destination)
    record = async (result = []) => new Promise(resolve => {
      recorder.port.onmessage = e => {
        if (e.data === null) resolve(result)
        else result.push(e.data)
      }
    })
    node.connect(recorder)
    node.setBpm(2296.875) // 1152 samples/beat
    node.clock.reset(-0.000001)
  })

  afterEach(async () => {
    node.close()
    recorder.disconnect()
  })

  it("should start bar 0, pause bar 1", async () => {
    node.start('bar', 0)
    node.pause('bar', 1)
    recorder.connect(context.destination)
    const result = await record()
    const expected = [
      0,0,0,0, 1,1,1,1, 0,0,0,0, 0,0,0,0,
      0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0
    ]
    expect(result).to.be.buffer(expected)
  })

  it("should start bar 0, pause bar 2", async () => {
    node.start('bar', 0)
    node.pause('bar', 2)
    recorder.connect(context.destination)
    const result = await record()
    const expected = [
      0,0,0,0, 1,1,1,1, 1,1,1,1, 0,0,0,0,
      0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0
    ]
    expect(result).to.be.buffer(expected)
  })

  it("should start bar 1, pause bar 2", async () => {
    node.start('bar', 1)
    node.pause('bar', 2)
    recorder.connect(context.destination)
    const result = await record()
    const expected = [
      0,0,0,0, 0,0,0,0, 1,1,1,1, 0,0,0,0,
      0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0
    ]
    expect(result).to.be.buffer(expected)
  })

  it("should start bar 2, pause bar 5", async () => {
    node.start('bar', 2)
    node.pause('bar', 5)
    recorder.connect(context.destination)
    const result = await record()
    const expected = [
      0,0,0,0, 0,0,0,0, 0,0,0,0, 1,1,1,1,
      1,1,1,1, 1,1,1,1, 0,0,0,0, 0,0,0,0
    ]
    expect(result).to.be.buffer(expected)
  })

  it("should start bar 2, pause bar 6", async () => {
    node.start('bar', 2)
    node.pause('bar', 6)
    const result = await record()
    const expected = [
      0,0,0,0, 0,0,0,0, 0,0,0,0, 1,1,1,1,
      1,1,1,1, 1,1,1,1, 1,1,1,1, 0,0,0,0
    ]
    expect(result).to.be.buffer(expected)
  })
})

describe("start + pause + start", () => {
  let node, context, recorder, record, rendered, initSource

  before(async () => {
    context = new AudioContext({ numberOfChannels: 1, sampleRate: 44100 })
  })

  beforeEach(async () => {
    node = new LoopScriptNode('/test/fixtures/dsp.js', { name: 'counter2' })
    await context.audioWorklet.addModule('/test/worklet-recorder.js')
    recorder = new AudioWorkletNode(context, 'recorder')
    recorder.connect(context.destination)
    record = async (result = []) => new Promise(resolve => {
      recorder.port.onmessage = e => {
        if (e.data === null) resolve(result)
        else result.push(e.data)
      }
    })
    node.connect(recorder)
    node.setBpm(2296.875) // 1152 samples/beat
    node.clock.reset(-0.000001)
  })

  afterEach(async () => {
    node.close()
    recorder.disconnect()
  })

  it("should start bar 0, pause bar 2, resume next bar", async () => {
    node.start('bar', 0)
    node.pause('bar', 2, () => node.start('bar'))
    const result = await record()
    const expected = [
      0,0,0,0, 5,6,7,8, 1,2,3,4, 0,0,0,0,
      // TODO: starts at 5, because paused at 4
      // but it isn't the right phase in the phrase
      // do we want to keep pause position
      // or should we always sync to phase?
      5,6,7,8, 1,2,3,4, 5,6,7,8, 1,2,3,4
    ]
    expect(result).to.be.buffer(expected)
  })

  it("should start bar 0, pause bar 2, resume after 1 bar", async () => {
    node.start('bar', 0)
    node.pause('bar', 2, () => node.start('bar', 1))
    const result = await record()
    const expected = [
      0,0,0,0, 5,6,7,8, 1,2,3,4, 0,0,0,0,
      0,0,0,0, 5,6,7,8, 1,2,3,4, 5,6,7,8
    ]
    expect(result).to.be.buffer(expected)
  })

  it("should start bar 1, pause bar 2, resume next bar", async () => {
    node.start('bar', 1)
    node.pause('bar', 2, () => node.start('bar'))
    const result = await record()
    const expected = [
      0,0,0,0, 0,0,0,0, 1,2,3,4, 0,0,0,0,
      1,2,3,4, 5,6,7,8, 1,2,3,4, 5,6,7,8
    ]
    expect(result).to.be.buffer(expected)
  })

  it("should start bar 1, pause bar 2, resume after 1 bar", async () => {
    node.start('bar', 1)
    node.pause('bar', 2, () => node.start('bar', 1))
    const result = await record()
    const expected = [
      0,0,0,0, 0,0,0,0, 1,2,3,4, 0,0,0,0,
      0,0,0,0, 1,2,3,4, 5,6,7,8, 1,2,3,4
    ]
    expect(result).to.be.buffer(expected)
  })
})
