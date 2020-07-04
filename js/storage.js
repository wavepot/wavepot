export default class Storage {
  constructor () {}

  async init () {
    this.storage = localStorage
  }

  async getItem (key) {
    return this.storage.getItem(key)
  }

  async setItem (key, value) {
    return this.storage.setItem(key, value)
  }
}
