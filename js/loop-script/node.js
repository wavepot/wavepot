import Context from './context.js'

export default class LoopScriptNode {
  constructor (wavepot, filename, method) {
    const { lengths } = wavepot.clock
    this.wavepot = wavepot
    this.context = new Context({ filename, method, length: lengths.bar, lengths })
    this.output = wavepot.audioContext.createGain()
    this.worker = new Worker('/js/loop-script/worker.js', { type: 'module' })
    this.worker.onmessage = ({ data }) => this['on' + data.type](data)
    this.worker.onerror = console.dir
    this.wavepot.metronome.addEventListener('bar', () => this.onbar())
  }

  createBuffer (barIndex) {
    return this.wavepot.getLoopBuffer({
      audioContext: this.wavepot.audioContext,
      numberOfChannels: this.context.setup.channels ?? this.context.firstSample?.length ?? 1,
      numberOfBars: this.context.setup.bars ?? 4,
      sampleRate: this.context.setup.sampleRate ?? this.wavepot.audioContext.sampleRate,
      barLength: this.wavepot.clock.n.bar
    })
  }

  connect (destination) {
    this.output.connect(destination)
  }

  start (syncType) {
    this.sync = this.wavepot.clock.sync() //this.context.meta?.renderDuration ?? 0.03)
    this.startBarIndex = 0
    if (syncType === 'bar') {
      this.startBarIndex = this.wavepot.clock.noteAt(this.wavepot.clock.current.time).bar // Math.floor(this.sync.bar / this.wavepot.clock.times.bar) % (this.context.setup.bars ?? 4)
    }
    this.buffer = this.createBuffer()
    this.buffer.setBarIndex(this.startBarIndex)
    this.buffer.connect(this.output)
    this.buffer.start(this.sync[syncType])
    // TODO: if setup is taking too long(infinite loop?), terminate worker and discard everything
    this.context.output = this.buffer.currentBarArray
    this.worker.postMessage({ type: 'setup', context: this.context })
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

