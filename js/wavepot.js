export default class Wavepot {
  constructor (opts = {}) {
    this.audioContext = opts.audioContext ?? new AudioContext({ numberOfChannels: 2, sampleRate: 44100 })
  }

  play (script) {

  }

  close () {
    try { this.audioContext.close() } catch {}
  }
}
