
/**
 * test
 */

import Delay from './index';
import { Saw } from 'opendsp/wavetable-osc';
import envelope from 'opendsp/envelope';

var delay = Delay();
var osc = Saw();

export function dsp(t){
  var out = osc(100) * .3 * envelope(t, 1/8, 30, 2);

  out = delay
    .feedback(.7)
    .delay(130 + (128 * Math.sin(.2 * t * Math.PI * 2)))
    .run(out);

  return out;
}
