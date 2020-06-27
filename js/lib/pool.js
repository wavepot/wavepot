export default class Pool {
  constructor (factory, initialSize = 0) {
    this.factory = factory
    this.used = []
    this.unused = Array(initialSize).fill().map(() => this.factory())
  }

  get () {
    let item
    if (this.unused.length > 1) {
      item = this.unused.shift()
    } else {
      item = this.factory()
    }
    this.used.push(item)
    return item
  }

  release (item) {
    this.unused.push(this.used.splice(this.used.indexOf(item), 1)[0])
  }

  get size () {
    return this.used.length + this.unused.length
  }
}
