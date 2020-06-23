
/**
 * test
 */

import chordsOf from './chords-of/index.js'
import { Tri } from './wavetable-osc/index.js'
import { scales } from './scales/index.js'
import Chord from './chord/index.js'
import note from './note/index.js'

export default async ({
  notes = scales.minor,
  osc = Tri,
  octave = 3,
  voices = 3,
  speed = 3,
  reverse = false,
  params = [20, false]
} = {}) => {
  var chords = chordsOf(notes, voices)
  var chord = Chord(osc, ...params)

  var progr = [
    chords.I,
    chords.III,
    chords.IV,
    chords.V
  ]

  if (reverse) progr.reverse()

  return t => {
    var c = progr[t/speed%progr.length|0].map(note)
    var chord_out = chord(c.map(oct(octave)), .12)
    return chord_out
  }
}

function oct(x){
  return function(y){
    for (var i = 0; i < x; i++) y *= 2
    return y;
  };
}
