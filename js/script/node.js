import ScriptSource from './source.js'

export default class ScriptNode {
  constructor (audioContext, filename, method, bpm, bars) {
    this.context = this.audioContext = audioContext
    this.output = this.audioContext.createGain()
    this.script = new ScriptSource(audioContext, filename, method, bpm, bars)
    this.clock = this.script.clock
    this.buffers = []
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

  start (bar = 0) {
    const syncTime = this.clock.syncAt(
      this.clock.current.time + this.clock.times.bar
    ).bar

    const oldBufferSource = this.bufferSource
    this.bufferSource = this.audioContext.createBufferSource()
    this.bufferSource.buffer = this.buffers[bar]
    this.bufferSource.connect(this.output)
    this.bufferSource.start(syncTime)
    if (oldBufferSource) oldBufferSource.stop(syncTime)
    return syncTime
  }

  stop () {
    this.bufferSource.stop()
  }

  connect (destination) {
    this.output.connect(destination)
  }
}
