import '../../setup.js'
import LoopScriptNode from '../../../js/loop-script/node.js'

describe("LoopScriptNode.start()", () => {
  let node, context, rendered

  beforeEach(() => {
    context = new OfflineAudioContext({ numberOfChannels: 1, length: 32, sampleRate: 44100 })
    node = new LoopScriptNode('/test/fixtures/dsp.js', { name: 'counter' })
    node.connect(context.destination)
    node.setBpm(2646000)
  })

  it("should start buffer at next beat", async () => {
    node.start('beat')
    await new Promise(resolve => setTimeout(resolve, 300))
    const result = (await context.startRendering()).getChannelData(0)
    const expected = [
       0,2,3,4, 5,6,7,8, 9,10,11,12, 13,14,15,16,
      17,2,3,4, 5,6,7,8, 9,10,11,12, 13,14,15,16
    ]
    expect(result).to.be.buffer(expected)
  })

  it("should start buffer at next bar", async () => {
    node.start('bar')
    await new Promise(resolve => setTimeout(resolve, 300))
    const result = (await context.startRendering()).getChannelData(0)
    const expected = [
      0,0,0,0,     5,6,7,8, 9,10,11,12, 13,14,15,16,
      17,18,19,20, 5,6,7,8, 9,10,11,12, 13,14,15,16,
    ]
    expect(result).to.be.buffer(expected)
  })

  it("should start buffer at next phrase", async () => {
    node.start('phrase')
    await new Promise(resolve => setTimeout(resolve, 300))
    const result = (await context.startRendering()).getChannelData(0)
    const expected = [
      0,0,0,0,     0,0,0,0,     0,0,0,0,     0,0,0,0,
      17,18,19,20, 21,22,23,24, 25,26,27,28, 29,30,31,32
    ]
    expect(result).to.be.buffer(expected)
  })
})

describe("LoopScriptNode.stop()", () => {
  let node, context, rendered

  beforeEach(() => {
    context = new OfflineAudioContext({ numberOfChannels: 1, length: 32, sampleRate: 44100 })
    node = new LoopScriptNode('/test/fixtures/dsp.js', { name: 'counter' })
    node.connect(context.destination)
    node.setBpm(2646000)
  })

  it('should start "beat" stop buffer at next "bar"', async () => {
    node.start('beat')
    node.stop('bar')
    await new Promise(resolve => setTimeout(resolve, 300))
    const result = (await context.startRendering()).getChannelData(0)
    const expected = [
      0,2,3,4, 0,0,0,0, 0,0,0,0, 0,0,0,0,
      0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
    ]
    expect(result).to.be.buffer(expected)
  })

  it('should start "beat" stop buffer at next "phrase"', async () => {
    node.start('beat')
    node.stop('phrase')
    await new Promise(resolve => setTimeout(resolve, 300))
    const result = (await context.startRendering()).getChannelData(0)
    const expected = [
      0,2,3,4, 5,6,7,8, 9,10,11,12, 13,14,15,16,
      0,0,0,0, 0,0,0,0, 0,0,0,0,    0,0,0,0,
    ]
    expect(result).to.be.buffer(expected)
  })

  it('should start "bar" stop buffer at next "phrase"', async () => {
    node.start('bar')
    node.stop('phrase')
    await new Promise(resolve => setTimeout(resolve, 300))
    const result = (await context.startRendering()).getChannelData(0)
    const expected = [
      0,0,0,0, 5,6,7,8, 9,10,11,12, 13,14,15,16,
      0,0,0,0, 0,0,0,0, 0,0,0,0,    0,0,0,0,
    ]
    expect(result).to.be.buffer(expected)
  })
})
