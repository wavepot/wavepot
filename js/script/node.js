import ScriptSource from './source.js'

export default class ScriptNode {
  constructor (audioContext, filename, method, bpm, bars) {
    this.context = this.audioContext = audioContext
    this.output = this.audioContext.createGain()
    this.buffers = []
    this.script = new ScriptSource(this.audioContext, filename, method, bpm, bars)
    this.clock = this.script.clock
  }

  destroy () {
    this.script.destroy()
    this.buffers = null
    this.clock = null
    this.output.disconnect()
    this.output = null
  }

  setup () {
    return this.script.setup()
  }

  async render (bar = 0, input, chain = false) {
    const output = await this.script.render(bar, input)
    if (chain) {
      return output
    } else {
      const { length, channels, sampleRate } = this.script.worker.context

      const buffer = this.buffers[bar] = this.buffers[bar] ??
        this.audioContext.createBuffer(
          channels,
          length,
          sampleRate
        )

      for (const [i, data] of output.entries()) {
        buffer.getChannelData(i).set(data)
      }
    }
  }

  start (bar = 0, syncTime) {
    const source = this.audioContext.createBufferSource()
    source.buffer = this.buffers[bar]
    source.connect(this.output)
    source.syncTime = syncTime
    source.start(syncTime)
    source.onended = () => source.disconnect()
    return source
  }

  connect (destination) {
    this.output.connect(destination)
  }
}
