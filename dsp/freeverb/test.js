
/**
 * test
 */

import Reverb from './index.js';

var dry, wet;
var step = 0.5;

var rev = Reverb();
rev.room(0.9).damp(0.9);

export function dsp(t) {
  dry = Math.sin(350 * t * Math.PI * 2) * Math.exp(50 * (-t/2 % step));
  dry += Math.sin(565 * t * Math.PI * 2) * Math.exp(50 * (-t/2 % step));
  wet = rev.run(dry);

  return dry + wet;
}
