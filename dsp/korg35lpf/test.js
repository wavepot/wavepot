
/**
 * test
 */

import LPF from './index';
import { Saw, Sin, Noise } from 'opendsp/wavetable-osc';

var lpf = LPF();
var osc = Saw();
var lfo = Sin();
//var lfo = Noise(8, false);

export function dsp(t){
  var out = osc(100);

  lpf
    .cut(1000 + (500 * lfo(0.5)))
    .res(1.9)
    .sat(1.6);

  out = lpf.run(out);

  return out;
}
