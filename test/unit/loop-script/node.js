import '../../setup.js'
import * as dsp from '../../fixtures/dsp.js'
import Clock from '../../../js/clock.js'
import Metronome from '../../../js/metronome.js'
import LoopScriptNode from '../../../js/loop-script/node.js'
import LoopBuffer from '../../../js/loop-script/buffer.js'

const dspRender = (fn, channels, length, start = 0, offset = 0) => {
  const output = Array(channels).fill().map(() => new Float32Array(length))
  for (let n = offset; n < length; n++) {
    let sample = fn({ valueOf: () => (1 + start + n) / (16 / 4 / 4), n })
    for (let channel = 0; channel < output.length; channel++) {
      output[channel][n] = Array.isArray(sample) ? sample[channel] : sample
    }
  }
  return output
}

describe("LoopScriptNode", () => {
  let node, context, wavepot, expected_a, expected_b

  beforeEach(() => {
    expected_a = dspRender(dsp.sine, 1, 32, 0, 0)
    expected_b = dspRender(dsp.anotherSine, 1, 32, 0, 0)
    context = new OfflineAudioContext({ numberOfChannels: 1, length: 32, sampleRate: 44100 })
    wavepot = {}
    wavepot.audioContext = context
    wavepot.bpm = 2646000 // 4 samples per bar
    wavepot.clock = new Clock(context).setBpm(wavepot.bpm)
    wavepot.metronome = new Metronome(wavepot).start()
    wavepot.getLoopBuffer = opts => {
      return new LoopBuffer(opts)
    }
    node = new LoopScriptNode(wavepot, '/test/fixtures/dsp.js', { name: 'sine' })
  })

  it("should play buffer at next beat", async () => {
    node.connect(context.destination)
    node.start('beat')
    await new Promise(resolve => setTimeout(resolve, 100))
    const result = (await context.startRendering()).getChannelData(0)
    const expected = new Float32Array(32)
    expected.set(expected_a[0].slice(0,16), 1)
    expected.set(expected_a[0].slice(0,16-1), 16+1)
    expect(result).to.be.buffer(expected)
  })

  it("should play buffer at next bar", async () => {
    node.connect(context.destination)
    node.start('bar')
    await new Promise(resolve => setTimeout(resolve, 100))
    const result = (await context.startRendering()).getChannelData(0)
    const expected = new Float32Array(32)
    expected.set(expected_a[0].slice(0,16), 4)
    expected.set(expected_a[0].slice(0,16-4), 16+4)
    expect(result).to.be.buffer(expected)
  })

  it("should play buffer at next phrase", async () => {
    node.connect(context.destination)
    node.start('phrase')
    await new Promise(resolve => setTimeout(resolve, 100))
    const result = (await context.startRendering()).getChannelData(0)
    const expected = new Float32Array(32)
    expected.set(expected_a[0].slice(0,16), 16)
    expect(result).to.be.buffer(expected)
  })
})
