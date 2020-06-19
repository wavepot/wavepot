class Recorder extends AudioWorkletProcessor {
  constructor () {
    super()
    this.i = 0
    this.result = 0
    console.log('worklet clock started:', currentTime)
  }

  process (inputs) {
    const data = inputs[0][0]
    let result = 0
    for (const el of data) {
      if (el !== 0) {
        result = el
        break
      }
    }

    if (result) {
      this.result = result
    } else {
      this.result = 0
    }

    ++this.i

    if (this.i % (9*2) === 0) {
      this.port.postMessage(this.result)
    }

    if (this.i === 32*9*2) {
      this.port.postMessage(null)
      return false
    }

    return true
  }
}

registerProcessor('recorder', Recorder)
