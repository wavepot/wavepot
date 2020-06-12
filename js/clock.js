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
    this.bpm = parseFloat((60 * (this.sampleRate / this.calcPpq())).toFixed(6))
    if (this.bpm !== bpm) {
      console.warn('adjusted bpm:', bpm, '->', this.bpm)
    }
    return this
  }

  get c () { return this.current }
  get p () { return this.note } // p = position
  get t () { return this.times }
  get n () { return this.lengths } // n = number of samples
  get r () { return this.remain() }
  get s () { return this.sync() }

  get currentTime () { return this.audioContext.currentTime - this.offsetTime }
  get sampleRate () { return this.audioContext.sampleRate }

  get current () {
    const t = this.t
    const offset = this.offsetTime
    const real = this.audioContext.currentTime
    const time = real - offset
    const beat = Math.floor(time / t.beat)
    const bar = Math.floor(time / t.bar)
    const phrase = Math.floor(time / t.phrase)
    return { offset, real, time, beat, bar, phrase }
  }

  get note () {
    const c = this.current
    const beat = Math.floor(c.beat % 16)
    const bar = Math.floor(c.bar % 4)
    const phrase = Math.floor(c.phrase % 4)
    return { beat, bar, phrase }
  }

  calcPpq () {
    const rate = this.sampleRate
    const beat = 60 / this.bpm
    this.ppq = Math.round(rate * beat)
    return this.ppq
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

  remain (pos = this.currentTime) {
    const t = this.t
    const beat = t.beat - (pos % t.beat)
    const bar = t.bar - (pos % t.bar)
    const phrase = t.phrase - (pos % t.phrase)
    return { beat, bar, phrase }
  }

  sync (ahead = 0) {
    const { time, offset } = this.current
    const pos = time + ahead
    const remain = this.remain(pos)
    const beat = pos + remain.beat + offset
    const bar = pos + remain.bar + offset
    const phrase = pos + remain.phrase + offset
    return { beat, bar, phrase }
  }
}
