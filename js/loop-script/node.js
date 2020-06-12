import Metronome from '../metronome.js'
import Clock from '../clock.js'
import Context from './context.js'
import getBuffer from './buffer-pool.js'

const path = import.meta.url.slice(0, import.meta.url.lastIndexOf('/'))

export default class LoopScriptNode {
  constructor (filename, method) {
    this.worker = new Worker(`${path}/worker.js`, { type: 'module' })
    this.worker.onmessage = ({ data }) => this['on' + data.type](data)
    this.worker.onerror = error => {
      console.error('LoopScriptNode: Worker failed')
      console.dir(error)
    }
    this.context = new Context({
      filename,
      method
    })
  }

  close () {
    this.audioContext = null
    this.worker.terminate()
    this.worker = null
    this.buffer = null
    this.clock = null
    if (this.metronome) this.metronome.stop()
    this.metronome = null
  }

  createBuffer (barIndex) {
    return getBuffer({
      audioContext: this.audioContext,
      numberOfChannels: this.context.setup.channels ?? this.context.firstSample?.length ?? 1,
      numberOfBars: this.context.setup.bars ?? 4,
      sampleRate: this.context.setup.sampleRate ?? this.audioContext.sampleRate,
      barLength: this.context.length
    })
  }

  setBpm (bpm) {
    this.clock.setBpm(bpm)
    this.context.lengths = this.clock.lengths
    this.context.length = this.clock.lengths.bar
    if (this.metronome) this.metronome.stop()
    const listener = () => this.onbar()
    this.metronome = new Metronome(this).start()
    this.metronome.addEventListener('bar', listener)
    this.metronome.addEventListener('ended', () => {
      this.metronome.removeEventListener('bar', listener)
    }, { once: true })
    return this
  }

  connect (destination) {
    this.audioContext = destination.context
    this.clock = new Clock(this.audioContext)
    this.context.sampleRate = this.audioContext.sampleRate
    this.output = this.audioContext.createGain()
    this.output.connect(destination)
    return this
  }

  start (syncType) {
    this.startBarIndex = 0
    this.sync = this.clock.sync //syncAt(this.clock.current.time + this.context.meta?.renderDuration ?? 0.03)
    if (syncType === 'bar') {
      this.startBarIndex = this.clock.positionAt(this.sync.bar).bar
      this.context.n = this.clock.currentAt(this.sync.bar).bar * this.clock.lengths.bar
    }
    if (syncType === 'beat') {
      this.beatOffset = this.clock.positionAt(this.sync.beat).beat
      this.context.n = this.clock.currentAt(this.sync.beat).beat * this.clock.lengths.beat
    }
    this.buffer = this.createBuffer()
    this.buffer.setBarIndex(this.startBarIndex)
    this.buffer.connect(this.output)
    this.buffer.start(this.sync[syncType])
    this.context.output = this.buffer.currentBarArray
    this.worker.postMessage({ type: 'setup', context: this.context })
    this.worker.timeout = setTimeout(() => {
      console.error('LoopScriptNode: Worker timeout')
      console.dir(this.context)
      this.close()
    }, 5000)
  }

  stop (syncType) {
    this.buffer.stop(this.clock.sync[syncType])
    this.buffer.addEventListener('ended', () => this.close())
  }

  render () {
    this.pending = true
    this.worker.postMessage({ type: 'render', context: this.context })
  }

  onbar () {
    if (this.buffer.isFull && !this.pending) {
      this.render()
    }
  }

  onsetup ({ context }) {
    clearTimeout(this.worker.timeout)

    this.context.put(context)

    this.context.setup.handle = this.context.setup.handle || ('channels' in this.context.setup)
    if (!this.context.setup.handle && !('firstSample' in this.context)) {
      this.worker.postMessage({ type: 'testFirstSample', context: this.context })
    } else {
      this.render()
    }
  }

  onrender ({ context }) {
    this.pending = false
    this.context.put(context)
    // const barIndex = this.wavepot.clock.current.bar % (this.context.setup.bars ?? 4)
    // if (barIndex !== this.buffer.currentBarIndex) {
      // we missed
    // }
    // this.sync = this.wavepot.clock.sync()
    this.buffer.commitCurrentArray()
    this.context.output = this.buffer.currentBarArray
    if (!this.buffer.isFull) {
      this.render()
    }
  }
}

