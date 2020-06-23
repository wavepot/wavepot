
/**
 * test
 */

import Allpass from './index.js';

var ap = Allpass(3000);
var dry, wet;

var ch = 1;
var out = [];
var step = 0.5;

export function dsp(t) {
  if ((t*4) % step === 0) ch = 1 - ch;
  
  dry = Math.sin(440 * t * Math.PI * 2) * Math.exp(100 * (-t/2 % step));
  wet = ap.run(dry);

  out = [
    1.3 * dry + (ch ? wet : 0),
    1.3 * dry + (ch ? 0 : wet)
  ];
  
  return out;
}
