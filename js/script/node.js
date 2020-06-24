import ScriptSource from './source.js'

export default class ScriptNode {
  constructor (audioContext, filename, method, bpm, bars) {
    this.context = this.audioContext = audioContext
    this.output = this.audioContext.createGain()
    this.buffers = []
    this.update(filename, method, bpm, bars)
  }

  destroy () {
    this.script.destroy()
    this.buffers = null
    this.clock = null
    if (!this.bufferSource) {
      this.output.disconnect()
      this.output = null
    }
  }

  update (filename, method, bpm, bars) {
    if (this.script) {
      this.script.destroy()
    }
    this.script = new ScriptSource(this.audioContext, filename, method, bpm, bars)
    this.clock = this.script.clock
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
    const source = this.bufferSource = this.audioContext.createBufferSource()
    source.buffer = this.buffers[bar]
    source.connect(this.output)
    source.start(syncTime)
    source.onended = () => {
      source.disconnect()
      if (this.bufferSource === source) {
        this.bufferSource = null
        if (!this.buffers) {
          this.output.disconnect()
          this.output = null
        }
      }
    }
    if (oldBufferSource) {
      oldBufferSource.stop(syncTime)
    }
    return syncTime
  }

  stop () {
    this.bufferSource.stop()
  }

  connect (destination) {
    this.output.connect(destination)
  }
}
