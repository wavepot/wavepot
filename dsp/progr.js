
/**
 * @module progr
 * @author stagas
 * @version 1.0.0
 * @desc seedable random chord progression generator
 * @license mit
 */

import rand from './seedable-random.js';
import Chords from './chords/index.js';

var notes = 'c,c#,d,d#,e,f,f#,g,g#,a,a#,b'.split(',');
var ckeys = Object.keys(Chords.chords).slice(2);

export default function(seed, size){
  rand.seed(seed);
  var progr = Array(size);
  for (var i = 0; i < size; i++) {
    var n = notes[rand() * notes.length | 0];
    var c = ckeys[rand() * ckeys.length | 0];
    progr[i] = n.toUpperCase() + c;
  }
  return progr;
}
