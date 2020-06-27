import Clock from '../clock.js'
import Context from '../dsp/context.js'
import bufferPool from './buffer-pool.js'

const samples = {}

export default class ScriptSource {
  constructor (audioContext, filename, method, bpm, bars) {
    this.context = this.audioContext = audioContext
    this.worker = new Worker('/js/dsp/worker.js', { type: 'module' })
    this.worker.onmessage = ({ data }) => this['on' + data.type](data)
    this.worker.onerror = error => {
      console.error('[ScriptSource] Worker failed: ' + error.message + ` ${error.filename} ${error.lineno}`)
      console.dir(error)
      this.destroy()
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
  }

  setup () {
    this.worker.postMessage({ type: 'setup', context: this.worker.context })
    return new Promise((resolve, reject) => {
      this.worker.setupTimeout = setTimeout(() => {
        console.error('ScriptSource: Worker setup timeout')
        console.dir(this.worker.context)
        reject()
      }, 10000)
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

    const pool = bufferPool(this.audioContext, channels, length)
    const buffer = pool.get()
    const { output } = buffer

    this.worker.context.n = bar * length
    this.worker.context._input = input
    this.worker.context.output = output

    return new Promise(resolve => {
      this.worker.renderResolve = output => {
        if (input && !this.worker.context.inputAccessed) {
          for (let i = 0; i < input[0].length; i++) {
            output[0][i] += input[0][i] // TODO: multi
          }
        }
        resolve(output)
        this.worker.context._input = null
        this.worker.context.output = null
        //pool.release(buffer)
      }
      this.worker.postMessage({ type: 'render', context: this.worker.context })
    })
  }

  onrender ({ context }) {
    this.worker.context.put(context)
    this.worker.renderResolve(context.output)
  }

  async onfetchsample ({ url }) {
    const path = '.' === url[0]
      ? url.split('/').slice(1,-1).join('/') + '/' + encodeURIComponent(url.split('/').pop())
      : url

    const sample = samples[url] = samples[url] ??
      (await this.audioContext.decodeAudioData(
        await (await fetch(path)).arrayBuffer()
      )).getChannelData(0)

    this.worker.postMessage({ type: 'callback', id: url, data: sample })
  }
}
