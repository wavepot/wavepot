export default class Context {
  constructor (data) {
    this.n = 0
    this.meta = {}
    this.setup = {}
    this.put(data)
  }

  get t () { // time is sample position divided by samples in beat
    return (1 + this.n) / this.lengths.beat
  }

  put (data) {
    Object.assign(this, data)
  }

  valueOf () {
    return this.t
  }
}
