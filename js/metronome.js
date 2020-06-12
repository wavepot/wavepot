export default class Metronome extends EventTarget {
  constructor ({ audioContext, clock }) {
    super()
    this.audioContext = audioContext
    this.clock = clock
  }

  get bar () { return this.clock.current.bar }

  start () {
    let ended = false
    let initial = true
    let prevSync

    const createNext = () => {
      const { t, s } = this.clock

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
        this.dispatchEvent(new CustomEvent('bar'))
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
      this.dispatchEvent(new CustomEvent('ended'))
    }

    return this
  }

  stop () { throw new Error('stop() failed: Metronome not started') }
}
