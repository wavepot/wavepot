import { Sin } from './wavetable-osc/index.js'
import tapeIt from './tape-it.js'

export default function Glitch (context) {
  const { blockFrames } = context
  return {
    reverse (fn, d = 1, i = 0) {
      var tape = tapeIt(fn, context)
      return t => tape[blockFrames - (i++ % Math.floor(blockFrames/d)) - 1]
    },
    stutter (fn, d, add, i = 0) {
      var tape = tapeIt(fn, context)
      if (add === true) {
        add = []
        for (var x = 0; x < 10000; x++) {
          add.push((((Math.random() * 32 | 0)/32) * blockFrames) | 0)
        }
      }
      return t => tape[((i++ % Math.floor(blockFrames/d)) +
        (Array.isArray(add) ? add[(t*1)%add.length|0] : add)
      ) % blockFrames]
    },
    vinyl (fn, i = 0) {
      console.log('n is', context.n, context.t)
      var tape = tapeIt(fn, context)
      var spin = Sin(null, null, .3004845)
      return t => tape[Math.floor(i++ * (spin(.02)/2+1)) % blockFrames]
    }
  }
}
