import Clock from '../clock.js'
import Context from '../dsp/context.js'
import getBuffer from './buffer-pool.js'

export default class LoopScriptNode {
  constructor (filename, method, setup = {}) {
    this.worker = new Worker('/js/dsp/worker.js', { type: 'module' })
    this.worker.onmessage = ({ data }) => this['on' + data.type](data)
    this.worker.onerror = error => {
      console.error('LoopScriptNode: Worker failed')
      console.dir(error)
    }
    this.context = new Context({
      filename,
      method,
      setup
    })
  }

  close () {
    this.audioContext = null
    this.worker.terminate()
    this.worker = null
    this.buffer = null
    try { this.clock.stop() } catch {}
    this.clock = null
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
    if (this.clock) try { this.clock.stop() } catch {}
    this.clock = new Clock().connect(this.output).setBpm(bpm)
    this.context.lengths = this.clock.lengths
    this.context.length = this.clock.lengths.bar
    const listener = () => this.onbar()
    this.output.addEventListener('bar', listener)
    this.output.addEventListener('clockended', () => {
      // TODO: handle re-start()
      this.output.removeEventListener('bar', listener)
    }, { once: true })
    return this
  }

  connect (destination, bpm) {
    this.audioContext = destination.context
    this.context.sampleRate = this.audioContext.sampleRate
    this.output = this.audioContext.createGain()
    this.output.connect(destination)
    if (bpm) this.setBpm(bpm)
    return this
  }

  start (syncType, ahead = 0) {
    if (!this.buffer) {
      this.buffer = this.createBuffer() // TODO: don't createbuffer when we need to reuse
      this.buffer.connect(this.output)
    // this.clock.reset()
    }
    // TODO: add meta.renderDuration to the mix for more accuracy
    this.clock.start()
    const syncTime = this.clock.syncAt(
      this.clock.c.time + this.clock.times[syncType] * ahead
    )[syncType]
    const syncFrame = this.clock.currentAt(syncTime)[syncType] * this.clock.lengths[syncType]
    this.buffer.start(syncTime)
    this.context.n = syncFrame
    this.context.output = this.buffer.currentBarArray
    // TODO: setup/test can run on keyup so the node ready for render on "save"
    // we can also render syncType="bar" in the background and commit the node
    // on user save so it's already rendered and the right bar will play.
    // Worst case we loop like this if we only have bar 1: 0000 1234 1234 5678
    if (!this.context.meta.hasSetup) {
      this.worker.postMessage({ type: 'setup', context: this.context })
      this.worker.timeout = setTimeout(() => {
        console.error('LoopScriptNode: Worker timeout')
        console.dir(this.context)
        this.close()
      }, 5000)
    }
    return syncTime
  }

  stop (syncType, ahead = 0) {
    let syncTime = syncType
    if (typeof syncType === 'string') {
      syncTime = this.clock.syncAt(
        this.clock.c.time + this.clock.times[syncType] * ahead
      )[syncType]
    }
    this.buffer.addEventListener('ended', () => this.close(), { once: true })
    this.buffer.stop(syncTime)
  }

  pause (syncType, ahead = 0, cb) {
    let syncTime = syncType
    if (typeof syncType === 'string') {
      syncTime = this.clock.syncAt(
        this.clock.c.time + this.clock.times[syncType] * ahead
      )[syncType]
    }
    this.buffer.addEventListener('paused', () => this.clock.stop(), { once: true })
    this.buffer.pause(syncTime, cb)
  }

  render () {
    console.log('render', this.context.filename)
    this.pending = true
    this.worker.postMessage({ type: 'render', context: this.context })
  }

  onbar () {
    if (this.buffer?.isFull && !this.pending) {
      this.render()
    }
  }

  onsetup ({ context }) {
    clearTimeout(this.worker.timeout)
    this.context.put(context)
    // TODO: separate these two operations and handle it with a state machine instead of heuristics
    this.context.setup.handle = this.context.setup.handle || ('channels' in this.context.setup)
    if (!this.context.setup.handle && !('firstSample' in this.context)) {
      this.worker.postMessage({ type: 'testFirstSample', context: this.context })
    } else {
      this.context.meta.hasSetup = true
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

