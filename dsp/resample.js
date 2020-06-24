import toFinite from './to-finite.js'

export default (context, sample, sig, offset) => {
  return toFinite(sample[((
    (context.n + (offset * context.length))
  * (sample.length / (context.length * sig))
  )|0) % sample.length])
}
