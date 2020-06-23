
/**
 * test
 */

import OnePoleFilter from './index.js';
import { Ramp } from 'opendsp/wavetable-osc';
import debug from 'debug';

var lp = OnePoleFilter('lpf');
var hp = OnePoleFilter('hpf');
var ap = OnePoleFilter('apf');
var osc_a = Ramp();
var osc_b = Ramp();
var osc_c = Ramp();

lp.cut(200);
hp.cut(5000);
ap.cut(900);

debug(lp.getFeedbackOutput());

export function dsp(t){
  var out_a, out_b, out_c;
  
  out_a = osc_a(93.78);
  out_a = lp.run(out_a);

  out_b = osc_b(93.73);
  out_b = hp.run(out_b);

  out_c = osc_c(94.00);
  out_c = ap.run(out_c);

  var out = out_a + out_b.hpf + out_c;

  return out;
}
