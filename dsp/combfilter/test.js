
/**
 * test
 */

import Comb from './index.js';

var ch = 1;
var out = [];
var step = 0.5;
var dry, wet;

var comb = Comb(5000);

comb.feedback = 1.05;
comb.damp = 0.8;

export function dsp(t) {
  if ((t/2) % step === 0) ch = 1 - ch;
  
  dry = Math.sin(440 * t * Math.PI * 2) * Math.exp(10 * (-t/2 % step));
  wet = comb.run(dry);

  return dry + wet;
}
