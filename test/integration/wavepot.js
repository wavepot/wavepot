import '../setup.js'
import Wavepot from '../../js/wavepot.js'

describe("new Wavepot()", () => {
  it("should create a new Wavepot session with defaults", () => {
    const wavepot = new Wavepot()
    expect(wavepot).to.be.an.instanceof(Wavepot)
    expect(wavepot.audioContext).to.be.an.instanceof(AudioContext)
    wavepot.close()
  })
})

describe("new Wavepot({ audioContext })", () => {
  it("should create a new Wavepot session using given audioContext", () => {
    const context = new OfflineAudioContext({ numberOfChannels: 1, length: 44100, sampleRate: 44100 })
    const wavepot = new Wavepot({ audioContext: context })
    expect(wavepot).to.be.an.instanceof(Wavepot)
    expect(wavepot.audioContext).to.be.an.instanceof(OfflineAudioContext)
  })
})

describe("wavepot.play(script)", () => {
  let wavepot, context

  beforeEach(() => {
    context = new OfflineAudioContext({ numberOfChannels: 1, length: 44100, sampleRate: 44100 })
    wavepot = new Wavepot({ audioContext: context })
  })

  it("should play back `script`", async () => {
    const fn = t => Math.sin(440 * t * Math.PI / 2)
    const fixture = `export default ${fn}`

    const length = wavepot.audioContext.length
    const expected = new Float32Array(length)
    for (let n = 0; n < length; n++) expected[n] = fn(length / (n + 1))

    wavepot.play(fixture)

    const result = (await context.startRendering()).getChannelData(0)
    expect(result).to.be.buffer(expected)
  })
})
