
/**
 * test
 */

import DiodeFilter from './index.js';
import { Ramp } from 'opendsp/wavetable-osc';

var lp = DiodeFilter();
var osc = Ramp();

export function dsp(t){
  var out = osc(93.78);
  
  lp
    .cut(0.93)
    .res(0.85)
    .hpf(0.0017);

  out = lp.run(out * 0.5) * 2;

  return out;
}
