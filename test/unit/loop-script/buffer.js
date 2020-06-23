import '../../setup.js'
import * as dsp from '../../fixtures/dsp.js'
import LoopBuffer from '../../../js/loop-script/buffer.js'

const dspRender = (fn, channels, length, start = 0) => {
  const output = Array(channels).fill().map(() => new Float32Array(length))
  for (let n = 0; n < length; n++) {
    let sample = fn({ valueOf: () => (1 + start + n) / (length / 4), n })
    for (let channel = 0; channel < output.length; channel++) {
      output[channel][n] = Array.isArray(sample) ? sample[channel] : sample
    }
  }
  return output
}

const dspRenderToBuffer = (fn, output, start) => {
  const length = output[0].length
  for (let n = 0; n < length; n++) {
    let sample = fn({ valueOf: () => (1 + start + n) / length, n })
    for (let channel = 0; channel < output.length; channel++) {
      output[channel][n] = Array.isArray(sample) ? sample[channel] : sample
    }
  }
}

describe("LoopBuffer", () => {
  let buffer, context, expected_a, expected_b

  beforeEach(() => {
    expected_a = dspRender(dsp.sine, 1, 16, 0)
    expected_b = dspRender(dsp.anotherSine, 1, 16, 0)
    context = new OfflineAudioContext({ numberOfChannels: 1, length: 16, sampleRate: 44100 })
    buffer = new LoopBuffer({
      numberOfChannels: 1,
      numberOfBars: 4,
      sampleRate: 44100,
      barLength: 4
    })
  })

  it("should play buffer", async () => {
    buffer.connect(context.destination)
    buffer.start()
    dspRenderToBuffer(dsp.sine, buffer.currentBarArray, buffer.currentBarArray.byteOffset)
    buffer.commitCurrentArray()
    dspRenderToBuffer(dsp.sine, buffer.currentBarArray, buffer.currentBarArray.byteOffset)
    buffer.commitCurrentArray()
    dspRenderToBuffer(dsp.sine, buffer.currentBarArray, buffer.currentBarArray.byteOffset)
    buffer.commitCurrentArray()
    dspRenderToBuffer(dsp.sine, buffer.currentBarArray, buffer.currentBarArray.byteOffset)
    expect(buffer.isFull).to.equal(false)
    buffer.commitCurrentArray()
    expect(buffer.isFull).to.equal(true)
    const result = (await context.startRendering()).getChannelData(0)
    expect(result).to.be.buffer(expected_a[0])
  })

  it("should loop buffer", async () => {
    buffer.connect(context.destination)
    buffer.start()
    dspRenderToBuffer(dsp.sine, buffer.currentBarArray, buffer.currentBarArray.byteOffset)
    buffer.commitCurrentArray()
    dspRenderToBuffer(dsp.sine, buffer.currentBarArray, buffer.currentBarArray.byteOffset)
    buffer.commitCurrentArray()
    dspRenderToBuffer(dsp.sine, buffer.currentBarArray, buffer.currentBarArray.byteOffset)
    buffer.commitCurrentArray()
    dspRenderToBuffer(dsp.sine, buffer.currentBarArray, buffer.currentBarArray.byteOffset)
    expect(buffer.isFull).to.equal(false)
    buffer.commitCurrentArray()
    expect(buffer.isFull).to.equal(true)
    dspRenderToBuffer(dsp.anotherSine, buffer.currentBarArray, buffer.currentBarArray.byteOffset)
    buffer.commitCurrentArray()
    dspRenderToBuffer(dsp.anotherSine, buffer.currentBarArray, buffer.currentBarArray.byteOffset)
    buffer.commitCurrentArray()
    dspRenderToBuffer(dsp.anotherSine, buffer.currentBarArray, buffer.currentBarArray.byteOffset)
    buffer.commitCurrentArray()
    dspRenderToBuffer(dsp.anotherSine, buffer.currentBarArray, buffer.currentBarArray.byteOffset)
    buffer.commitCurrentArray()
    expect(buffer.isFull).to.equal(true)
    const result = (await context.startRendering()).getChannelData(0)
    expect(result).to.be.buffer(expected_b[0])
  })

  it("should loop properly with 1 bar", async () => {
    buffer.connect(context.destination)
    buffer.start()
    buffer.currentBarArray[0].set([1,2,3,4])
    buffer.commitCurrentArray()
    expect(buffer.isFull).to.equal(false)
    const result = (await context.startRendering()).getChannelData(0)
    expect(result).to.be.buffer([1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4])
  })

  it("should loop properly with 2 bars", async () => {
    buffer.connect(context.destination)
    buffer.start()
    buffer.currentBarArray[0].set([1,2,3,4])
    buffer.commitCurrentArray()
    buffer.currentBarArray[0].set([5,6,7,8])
    buffer.commitCurrentArray()
    expect(buffer.isFull).to.equal(false)
    const result = (await context.startRendering()).getChannelData(0)
    expect(result).to.be.buffer([1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8])
  })

  it("should loop properly with 3 bars", async () => {
    buffer.connect(context.destination)
    buffer.start()
    buffer.currentBarArray[0].set([1,2,3,4])
    buffer.commitCurrentArray()
    buffer.currentBarArray[0].set([5,6,7,8])
    buffer.commitCurrentArray()
    buffer.currentBarArray[0].set([9,10,11,12])
    buffer.commitCurrentArray()
    expect(buffer.isFull).to.equal(false)
    const result = (await context.startRendering()).getChannelData(0)
    expect(result).to.be.buffer([1,2,3,4,5,6,7,8,9,10,11,12,5,6,7,8])
  })

  it("should start at bar index 1", async () => {
    buffer.setBarIndex(1)
    buffer.connect(context.destination)
    buffer.start()
    buffer.currentBarArray[0].set([1,2,3,4])
    buffer.commitCurrentArray()
    buffer.currentBarArray[0].set([5,6,7,8])
    buffer.commitCurrentArray()
    buffer.currentBarArray[0].set([9,10,11,12])
    buffer.commitCurrentArray()
    expect(buffer.isFull).to.equal(false)
    const result = (await context.startRendering()).getChannelData(0)
    expect(result).to.be.buffer([0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12])
  })

  it("should loop properly at index 1", async () => {
    buffer.setBarIndex(1)
    buffer.connect(context.destination)
    buffer.createBufferSource()
    buffer.currentBarArray[0].set([1,2,3,4])
    buffer.commitCurrentArray()
    buffer.currentBarArray[0].set([5,6,7,8])
    buffer.commitCurrentArray()
    buffer.currentBarArray[0].set([9,10,11,12])
    buffer.commitCurrentArray()
    buffer.currentBarArray[0].set([13,14,15,16])
    buffer.commitCurrentArray()
    buffer.start()
    expect(buffer.isFull).to.equal(true)
    const result = (await context.startRendering()).getChannelData(0)
    expect(result).to.be.buffer([13,14,15,16,1,2,3,4,5,6,7,8,9,10,11,12])
  })
})
