export default class Clock {
  constructor () {
    this.offsetTime = 0
  }

  connect (destination, bpm) {
    this.destination = destination
    this.context = this.audioContext = this.destination.context
    if (bpm) this.setBpm(bpm)
    return this
  }

  get bar () { return this.current.bar }

  start () {
    let ended = false
    let initial = true
    let prevSync

    const createNext = () => {
      const { t, s } = this

      let syncTime = s.bar
      // prevent two nodes from firing at the same time
      if (prevSync && parseFloat(syncTime.toFixed(3)) <= parseFloat(prevSync.toFixed(3))) {
        syncTime += t.bar
      }

      // ConstantSourceNodes are cheap so we can
      // continuously fire and trash them and they
      // will be garbage collected
      const node = this.audioContext.createConstantSource()
      node.syncTime = syncTime
      node.onended = () => {
        node.onended = null
        if (ended) return // ended outside event handler
        this.destination.dispatchEvent(new CustomEvent('bar'))
        if (ended) return // ended during event handler
        createNext()
      }
      node.start()
      node.stop(syncTime)
      prevSync = syncTime

      if (initial) {
        initial = false
        createNext()
      }
    }

    createNext()

    this.stop = () => {
      ended = true
      this.stop = Object.getPrototypeOf(this).stop //???
      this.destination.dispatchEvent(new CustomEvent('clockended'))
    }

    return this
  }

  stop () { throw new Error('clock stop() failed: Not started') }

  reset (n = 0) {
    this.offsetTime = this.audioContext.currentTime + n
    return this
  }

  setBpm (bpm) {
    this.bpm = bpm
    this.bpm = parseFloat((60 * (this.sampleRate / this.ppq)).toFixed(6))
    if (this.bpm !== bpm) console.warn('adjusted bpm:', bpm, '->', this.bpm)
    return this
  }

  get currentTime () { return this.audioContext.currentTime - this.offsetTime }
  get sampleRate () { return this.audioContext.sampleRate }

  get c () { return this.current }
  get p () { return this.position }
  get t () { return this.times }
  get n () { return this.lengths } // n = number of samples
  get r () { return this.remain }
  get s () { return this.sync }

  get ppq () {
    const rate = this.sampleRate
    const beat = 60 / this.bpm
    const ppq = Math.round(rate * beat)
    return ppq
  }

  get current () {
    const t = this.t
    const offset = this.offsetTime
    const real = this.audioContext.currentTime
    const time = real - offset
    return { offset, real, time, ...this.currentAt(time) }
  }

  currentAt (time) {
    const t = this.t
    const beat = Math.floor(time / t.beat)
    const bar = Math.floor(time / t.bar)
    const phrase = Math.floor(time / t.phrase)
    return { beat, bar, phrase }
  }

  get position () {
    return this.positionAt(this.current.time)
  }

  positionAt (time) {
    const c = this.currentAt(time)
    const beat = Math.floor(c.beat % 16)
    const bar = Math.floor(c.bar % 4)
    const phrase = Math.floor(c.phrase % 4)
    return { beat, bar, phrase }
  }

  get times () {
    const n = this.lengths
    const beat = n.beat / n.rate
    const bar = n.bar / n.rate
    const phrase = n.phrase / n.rate
    return { beat, bar, phrase }
  }

  get lengths () {
    const rate = this.sampleRate
    const beat = this.ppq
    const bar = 4 * beat
    const phrase = 4 * bar
    return { rate, beat, bar, phrase }
  }

  get remain () {
    return this.remainAt(this.current.time)
  }

  remainAt (time) {
    const t = this.t
    const beat = t.beat - (time % t.beat)
    const bar = t.bar - (time % t.bar)
    const phrase = t.phrase - (time % t.phrase)
    return { beat, bar, phrase }
  }

  get sync () {
    return this.syncAt(this.current.time)
  }

  syncAt (time) {
    const { offset } = this.current
    const remain = this.remainAt(time)
    const beat = time + remain.beat + offset
    const bar = time + remain.bar + offset
    const phrase = time + remain.phrase + offset
    return { beat, bar, phrase }
  }
}
