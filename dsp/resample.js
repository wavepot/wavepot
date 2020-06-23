import { blockFrames } from '../settings.js'

export default function resample (f, sample, sig, offset) {
  return normalize(sample[((
    (f + (offset * blockFrames))
  * (sample.length / (blockFrames * sig))
  )|0) % sample.length])
}

function normalize(number) {
  return number === Infinity || number === -Infinity || isNaN(number) ? 0 : number;
}
