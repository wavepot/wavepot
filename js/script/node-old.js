import Clock from '../clock.js'
import Context from '../dsp/context.js'

export default class ScriptNode {
  constructor (filename, method, setup = {}) {
    this.worker = new Worker('/js/dsp/worker.js', { type: 'module' })
    this.worker.onmessage = ({ data }) => this['on' + data.type](data)
    this.worker.onerror = error => {
      console.error('ScriptNode: Worker failed')
      console.dir(error)
      this.close()
    }
    this.worker.context = new Context({
      filename,
      method,
      setup
    })
  }

  close () {
    this.audioContext = null
    try { this.worker.terminate() } catch {}
    this.worker = null
    this.buffer = null
    try { this.clock.stop() } catch {}
    this.clock = null
  }

  createBuffer () {
    const audioContext = this.audioContext
    const numberOfChannels = this.worker.context.setup.channels ?? this.worker.context.firstSample?.length ?? 1
    const numberOfBars = this.worker.context.setup.bars ?? 1
    const sampleRate = this.worker.context.setup.sampleRate ?? this.audioContext.sampleRate
    const barLength = this.worker.context.length
    const totalLength = barLength * numberOfBars

    this.sharedBuffer = Array(numberOfChannels).fill().map(() =>
      new SharedArrayBuffer(
        totalLength * Float32Array.BYTES_PER_ELEMENT
      )
    )

    this.arrayBuffer = Array(numberOfChannels).fill().map((_, channelIndex) =>
      new Float32Array(
        this.sharedBuffer[channelIndex],
        0,
        totalLength
      )
    )

    this.audioBuffer = this.audioContext.createBuffer(
      numberOfChannels,
      totalLength,
      sampleRate
    )
  }

  setBpm (bpm) {
    this.clock.setBpm(bpm)
    this.worker.context.lengths = this.clock.lengths
    return this
  }

  connect (destination, bpm) {
    this.context = this.audioContext = destination.context
    this.worker.context.sampleRate = this.audioContext.sampleRate
    this.output = this.audioContext.createGain()
    this.output.connect(destination)
    this.clock = new Clock().connect(this.output)
    if (bpm) this.setBpm(bpm)
    return this
  }

  render () {
    this.worker.context.length = this.clock.lengths.bar * (this.worker.context.setup.bars ?? 1)
    this.worker.postMessage({ type: 'setup', context: this.worker.context })
    return new Promise((resolve, reject) => {
      this.worker.timeout = setTimeout(() => {
        console.error('ScriptNode: Worker timeout')
        console.dir(this.worker.context)
        reject()
      }, 5000)
      this.worker.resolve = resolve
    })
  }

  onsetup ({ context }) {
    clearTimeout(this.worker.timeout)
    this.worker.context.put(context)
    // TODO: separate these two operations and handle it with a state machine instead of heuristics
    this.worker.context.setup.handle = this.worker.context.setup.handle || ('channels' in this.worker.context.setup)
    if (!this.worker.context.setup.handle && !('firstSample' in this.worker.context)) {
      this.worker.postMessage({ type: 'testFirstSample', context: this.worker.context })
    } else {
      this.createBuffer()
      this.worker.context.output = this.arrayBuffer
      this.worker.postMessage({ type: 'render', context: this.worker.context })
    }
  }

  onrender ({ context }) {
    this.worker.context.put(context)
    for (const [channelIndex, arrayChannel] of this.arrayBuffer.entries()) {
      this.audioBuffer.getChannelData(channelIndex).set(arrayChannel, 0)
    }
    this.worker.resolve()
  }

  play (syncType, ahead = 0) {
    const syncTime = this.clock.syncAt(
      this.clock.current.time + this.clock.times[syncType] * ahead
    )[syncType]
    this.bufferSource = this.audioContext.createBufferSource()
    this.bufferSource.buffer = this.audioBuffer
    this.bufferSource.connect(this.output)
    this.bufferSource.start(syncTime)
  }

  stop () {
    this.bufferSource.stop()
  }
}
