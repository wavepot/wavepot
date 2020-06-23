
/**
 * test
 */

import note from 'opendsp/note';
import env from 'opendsp/envelope';
import { Saw, Tri, Sqr } from 'opendsp/wavetable-osc';
import Chord from 'stagas/chord/1.1.0';
import Chords from './index';
import Debug from 'debug';

var debug = Debug('chords');
var base = oct(6);
var chord = Chord(Saw, 36);
var progr = ['Bmaj7','Ebmaj9','F9','Abmin7'].map(Chords);

debug(Object.keys(Chords.chords));

export function dsp(t) {
  var c = progr[3-(t%4|0)];
  var vol = env(t*2, 1/6, 6, 4) * env(t+3/8, 1/4, 3, 1);
  return 1.5 * vol * chord(c.map(note).map(base), .2);
}

function oct(x){
  return function(y){
    return x * y;
  };
}
