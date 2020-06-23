
/**
 * @test
 */

import note from 'opendsp/note';
import env from 'opendsp/envelope';
import { Sin, Saw, Tri, Sqr } from 'opendsp/wavetable-osc';
import Chord from 'stagas/chord/1.1.0';
import Chords from 'stagas/chords';
import Nopop from './index';

var base = oct(4);
var chord = Chord(Saw, 25);
var progr = ['Chdim7','Gmaj9','A#min11','Abmin9'].map(Chords);
var sin = Sin(16);

var noclick = Nopop();

export function dsp(t) {
  var c = progr[3-((t/4)%4|0)];
  var kick = sin(
    env(t, 1/8, 39, 10)*150 * 
    (Math.exp(.3) * Math.exp(.3) * .7)) * 
    env(t, 1/8, 22, 2);
  var vol = env(t*2, 1/6, 6, 4) * env(t+3/8, 1/4, 3, 1);
  var mix = noclick(
    0.6 * vol * chord(c.map(note).map(base), .05)
  + 0.7 * kick
  );
  return mix;
}

function oct(x){
  return function(y){
    return x * y;
  };
}
