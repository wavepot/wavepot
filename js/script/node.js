import ScriptSource from './source.js'

export default class ScriptNode {
  constructor (audioContext, filename, method, bpm, bars) {
    this.context = this.audioContext = audioContext
    this.output = this.audioContext.createGain()
    this.bars = bars
    this.scriptSource = new ScriptSource(audioContext, filename, method, bpm, bars)
    this.clock = this.scriptSource.clock
  }

  render () {
    return this.scriptSource.render()
  }

  start (syncType, offset = 0, duration = this.bars, ahead = 0) {
    const syncTime = this.clock.syncAt(
      this.clock.current.time + this.clock.times[syncType] * ahead
    )[syncType]
    const offsetTime = this.clock.times[syncType] * offset
    const durationTime = (this.clock.times[syncType] * duration) - offsetTime
    const oldBufferSource = this.bufferSource
    this.bufferSource = this.audioContext.createBufferSource()
    this.bufferSource.buffer = this.scriptSource.audioBuffer
    this.bufferSource.connect(this.output)
    this.bufferSource.start(syncTime, offsetTime, durationTime)
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
