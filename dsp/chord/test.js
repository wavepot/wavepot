
/**
 * test
 */

import note from 'opendsp/note';
import env from 'opendsp/envelope';
import { Tri, Saw, Sqr } from 'opendsp/wavetable-osc';
import { sin } from 'opendsp/osc';

import Chord from './index';

var base = oct(0.5);
var chord = Chord(Saw, 16, true);
var progr = [
  ['f4','a4','c5','d#5'].map(note).map(base),
  ['a4','c5','d#5','f5'].map(note).map(base),
  ['c5','d#5','f5','a5'].map(note).map(base),
  ['d#5','f5','a5','c6'].map(note).map(base),
];

export function dsp(t){
  t *= 1;
  
  var kick = Math.sin(67 * env(t*2, 1/4, 28, 1.5));

  var c = progr[3-(t%4|0)];
  
  var mix = (
    .5 * chord(c.map(vibrato(t,4,4))) * env(t+1/8, 1/16, 3, 2) * env(t+3/4, 1/4, 2, 1) * env(t+3/8, 1/2, 1, 3)
  + .7 * kick
  );
  
  return mix;
}

function vibrato(t, f, n){
  return function(x){
    return x + (sin(t, f) * n);
  };
}

function oct(x){
  return function(f){
    return f * x;
  };
}
