import Pool from '../lib/pool.js'
import LoopBuffer from '../loop-buffer.js'

export const contexts = new WeakMap

export default (opts) => {
  const pools = contexts.get(opts.audioContext) ?? {}
  contexts.set(opts.audioContext, pools)

  const key = [opts.numberOfChannels, opts.numberOfBars, opts.sampleRate].join()
  const pool = pools[key] = pools[key] ?? new Pool(() => new LoopBuffer(opts))

  const buffer = pool.get()
  buffer.addEventListener('ended', () => pool.release(buffer), { once: true })

  return buffer
}
