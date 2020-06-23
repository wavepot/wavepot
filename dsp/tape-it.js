import normalize from './normalize.js'

export default function tapeIt (fn, context) {
  const floats = new Float32Array(context.blockFrames)
  for (let i = 0, n = context.n, sample = 0; i < context.blockFrames; i++, n++) {
    sample = fn(n / context.beatFrames, n)
    floats[i] = normalize(sample)
  }
  return floats
}
