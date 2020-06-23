import Clock from '../clock.js'
import Context from '../dsp/context.js'

export default class ScriptSource {
  constructor (audioContext, filename, method, bpm, bars) {
    this.context = this.audioContext = audioContext
    this.worker = new Worker('/js/dsp/worker.js', { type: 'module' })
    this.worker.onmessage = ({ data }) => this['on' + data.type](data)
    this.worker.onerror = error => {
      console.error('ScriptSource: Worker failed')
      console.dir(error)
      this.close()
    }
    this.worker.context = new Context({
      filename,
      method
    })
    this.clock = new Clock().connect(this.audioContext.destination)
    this.clock.setBpm(bpm)
    this.worker.context.bars = bars
    this.worker.context.lengths = this.clock.lengths
    this.worker.context.length = this.clock.lengths.bar
    this.worker.context.totalLength = this.clock.lengths.bar * bars
    this.worker.context.sampleRate = this.audioContext.sampleRate
    this.barIndex = -1
  }

  setup () {
    this.worker.postMessage({ type: 'setup', context: this.worker.context })
    return new Promise((resolve, reject) => {
      this.worker.setupTimeout = setTimeout(() => {
        console.error('ScriptSource: Worker setup timeout')
        console.dir(this.worker.context)
        reject()
      }, 5000)
      this.worker.setupResolve = resolve
    })
  }

  get currentBarArray () {
    return this.barArrays[this.barIndex]
  }

  async render () {
    await this.setup()

    const {
      length,
      totalLength,
      bars,
      channels,
      sampleRate
    } = this.worker.context

    this.sharedBuffer = Array(channels).fill().map(() =>
      new SharedArrayBuffer(
        totalLength * Float32Array.BYTES_PER_ELEMENT
      )
    )

    this.audioBuffer = this.audioContext.createBuffer(
      channels,
      totalLength,
      sampleRate
    )

    this.barArrays = Array(bars).fill().map((_, barIndex) => {
      const barArray = Array(channels).fill().map((_, channelIndex) =>
        new Float32Array(
          this.sharedBuffer[channelIndex],
          barIndex * length * 4,
          length
        )
      )
      barArray.byteOffset = barIndex * length
      return barArray
    })

    await this.renderNext()
  }

  renderNext () {
    this.barIndex++
    console.log('render bar', this.barIndex)
    this.worker.context.output = this.currentBarArray
    return new Promise(resolve => {
      this.worker.renderResolve = resolve
      this.worker.postMessage({ type: 'render', context: this.worker.context })
    })
  }

  onsetup ({ context }) {
    clearTimeout(this.worker.setupTimeout)
    this.worker.context.put(context)
    // TODO: separate these two operations and handle it with a state machine instead of heuristics
    this.worker.context.handle = this.worker.context.handle || ('channels' in this.worker.context)
    if (!this.worker.context.handle && !('firstSample' in this.worker.context)) {
      this.worker.postMessage({ type: 'testFirstSample', context: this.worker.context })
    } else {
      this.worker.context.channels =
        this.worker.context.channels ??
        this.worker.context.firstSample?.length ??
        1
      this.worker.setupResolve()
    }
  }

  onrender ({ context }) {
    this.worker.context.put(context)
    for (const [channelIndex, barArrayChannel] of this.currentBarArray.entries()) {
      this.audioBuffer
        .getChannelData(channelIndex)
        .set(barArrayChannel, this.currentBarArray.byteOffset)
    }
    if (this.barIndex === 0) {
      this.worker.renderResolve()
    }
    if (this.barIndex < this.worker.context.bars - 1) {
      this.renderNext()
    }
  }
}
