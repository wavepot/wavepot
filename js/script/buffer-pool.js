import Pool from '../lib/pool.js'

export const contexts = new WeakMap

export default (audioContext, channels, length) => {
  const pools = contexts.get(audioContext) ?? {}
  contexts.set(audioContext, pools)

  const key = [channels, length].join()
  const pool = pools[key] = pools[key] ??
    new Pool(() => new SharedBuffer(channels, length))

  return pool
}

class SharedBuffer {
  constructor (channels, length) {
    this.buffer = Array(channels).fill().map(() =>
      new SharedArrayBuffer(
        length * Float32Array.BYTES_PER_ELEMENT
      )
    )

    this.output = Array(channels).fill().map((_, i) =>
      new Float32Array(this.buffer[i], 0, length)
    )
  }
}
