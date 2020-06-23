
/**
 * test
 */

import { scales } from './index';
import { Tri } from 'opendsp/wavetable-osc';
import note from 'opendsp/note';
import Debug from 'debug';

var debug = Debug('scales test');
var sk = Object.keys(scales);
var tri = Tri();

export function dsp(t){
  var sn = sk[(t/4)%sk.length|0];
  var s = scales[sn];
  debug(sn, s);
  return tri(note(s[t*4%s.length|0])*10) * 0.5;
}
