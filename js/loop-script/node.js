export default class LoopScriptNode {
  constructor (wavepot, filename, method) {
    const { lengths } = wavepot.clock
    this.wavepot = wavepot
    this.context = new Context({ filename, method, lengths })
    this.output = wavepot.audioContext.createGain()
    this.worker = new Worker('./worker.js', { type: 'module' })
    this.worker.onmessage = ({ data }) => this['on' + data.type](data)
    this.wavepot.metronome.addEventListener('bar', () => this.onbar())
  }

  createBuffer (barIndex) {
    this.buffer = this.wavepot.getLoopBuffer({
      numberOfChannels: this.context.setup.channels ?? this.context.firstSample?.length ?? 1,
      numberOfBars: this.context.setup.bars ?? 4,
      sampleRate: this.context.setup.sampleRate ?? this.wavepot.audioContext.sampleRate
    })
    this.buffer.setBarIndex(barIndex)
    this.buffer.connect(this.output)
    return this.buffer
  }

  connect (destination) {
    this.output.connect(destination)
  }

  start (syncType) {
    this.sync = this.wavepot.clock.sync(this.context.meta?.renderDuration ?? 0.03)
    this.startBarIndex = 0
    if (syncType === 'bar') {
      this.startBarIndex = Math.floor(this.sync.bar / this.wavepot.clock.times.bar) % (this.context.setup.bars ?? 4)
    }
    this.context.output = this.createBuffer(this.startBarIndex).currentBarArray
    this.buffer.start(this.sync[syncType])
    // TODO: if setup is taking too long(infinite loop?), terminate worker and discard everything
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
    if (!this.context.setup.handle || !('firstSample' in this.context)) {
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
    if (!this.buffer.isFull) {
      this.render()
    }
  }
}

