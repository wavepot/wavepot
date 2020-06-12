export default class Clock {
  constructor (audioContext) {
    this.audioContext = audioContext
    this.offsetTime = 0
  }

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
