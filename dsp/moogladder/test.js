
/**
 * test
 */

import LPF from './index';
import { Saw, Sin, Noise } from 'opendsp/wavetable-osc';

var lpf1 = LPF('half');
var lpf2 = LPF('full');
var osc1 = Saw();
var osc2 = Saw();
var lfo = Sin();
//var lfo = Noise(8, false);

export function dsp(t){
  var out1 = osc1(100);
  var out2 = osc2(300);

  lpf1
    .cut(1000 + (800 * lfo(0.5)))
    .res(0.7)
    .sat(1.5)
    .update();

  lpf2
    .cut(3000 + (800 * lfo(0.5)))
    .res(1.6)
    .sat(1.2)
    .update();

  out1 = lpf1.run(out1);
  out2 = lpf2.run(out2);

  var out = out1 + out2;
  
  return out;
}
