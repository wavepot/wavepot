import '../../setup.js'
import ScriptNode from '../../../js/script/node.js'

describe("ScriptNode.play()", () => {
  let context, rendered

  const createNode = bars => {
    const node = new ScriptNode('/test/fixtures/dsp.js', { name: 'counter' }, { bars })
    node.connect(context.destination)
    node.setBpm(2646000)
    return node
  }

  beforeEach(() => {
    context = new OfflineAudioContext({ numberOfChannels: 1, length: 32, sampleRate: 44100 })
  })

  it("should start buffer at next beat", async () => {
    const node = createNode(4)
    await node.render()
    node.play('bar')
    await new Promise(resolve => setTimeout(resolve, 300))
    const result = (await context.startRendering()).getChannelData(0)
    const expected = [
      0,0,0,0,     1,2,3,4, 5,6,7,8, 9,10,11,12,
      13,14,15,16, 0,0,0,0, 0,0,0,0, 0,0,0,0
    ]
    expect(result).to.be.buffer(expected)
  })
})
