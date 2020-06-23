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
    this.clock = new Clock().connect(this.audioContext.destination)
    this.clock.setBpm(bpm)
    this.worker.context = new Context({
      filename,
      method,
      channels: 1,
      bars,
      length: this.clock.lengths.bar,
      lengths: this.clock.lengths,
      totalLength: this.clock.lengths.bar * bars,
      sampleRate: this.audioContext.sampleRate
    })
  }

  destroy () {
    try { this.worker.terminate() } catch {}
    this.clock = null
    this.worker = null
    this.worker.context = null
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

  onsetup ({ context }) {
    clearTimeout(this.worker.setupTimeout)
    this.worker.context.put(context)
    this.worker.setupResolve(this)
  }

  render (bar = 0, input) {
    const {
      length,
      bars,
      channels,
      sampleRate
    } = this.worker.context

    // const audioBuffer = this.audioContext.createBuffer(
    //   channels,
    //   length,
    //   sampleRate
    // )

    const sharedBuffer = Array(channels).fill().map(() =>
      new SharedArrayBuffer(
        length * Float32Array.BYTES_PER_ELEMENT
      )
    )

    const output = Array(channels).fill().map((_, i) =>
      new Float32Array(sharedBuffer[i], 0, length)
    )

    this.worker.context.n = bar * length
    this.worker.context.input = input
    this.worker.context.output = output

    return new Promise(resolve => {
      this.worker.renderResolve = resolve
      this.worker.postMessage({ type: 'render', context: this.worker.context })
    })
  }

  onrender ({ context }) {
    this.worker.context.put(context)
    this.worker.renderResolve(context.output)

    // for (const [i, array] of output.entries()) {
    //   audioBuffer
    //     .getChannelData(i)
    //     .set(array)
    // }

    // if (this.barIndex === 0) {
    // }
    // if (this.barIndex < this.worker.context.bars - 1) {
      // this.renderNext()
    // }
  }
}
