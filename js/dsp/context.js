export default class Context {
  constructor (data) {
    this.n = 0
    this.put(data)
  }

  get t () { // time is sample position divided by samples in beat
    return (1 + this.n) / this.lengths.beat
  }

  get input () {
    this.inputAccessed = true
    return this._input
  }

  put (data) {
    Object.assign(this, data)
  }

  valueOf () {
    return this.t
  }
}
