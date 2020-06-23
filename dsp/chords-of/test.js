
/**
 * test
 */

import chordsOf from './index';
import { Saw } from 'opendsp/wavetable-osc';
import { scales } from 'stagas/scales';
import Chord from 'stagas/chord/1.1.0';
import note from 'opendsp/note';
import Debug from 'debug';

var debug = Debug('chords-of test');

var Cminor = scales.minor;
var chords = chordsOf(Cminor, 4);

assert(chords.I == '0,3,7,10');
assert(chords.V == '7,10,14,17');

chords = chordsOf(Cminor);

assert(chords.I   == '0,3,7');
assert(chords.II  == '2,5,8');
assert(chords.III == '3,7,10');
assert(chords.IV  == '5,8,12');
assert(chords.V   == '7,10,14');
assert(chords.VI  == '8,12,15');
assert(chords.VII == '10,14,17');

debug('ok', chords.I, chords.iii, chords.V);

var chord = Chord(Saw, 16);

var progr = [
  chords.I,
  chords.III,
  chords.IV,
  chords.V
];

export function dsp(t){
  var c = progr[t%progr.length|0].map(note);
  var chord_out = chord(c.map(mul(8)), .13);
  return chord_out;
}

function assert(expr){ if (!expr) throw new Error('failed') }

function mul(x){
  return function(y){
    return x * y;
  };
}
