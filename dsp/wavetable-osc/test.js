
/**
 * test
 */

import Osc from './index';
import { Sin, Saw, Sqr, Tri, Ramp, Noise } from './index';

var osc = Osc('tri');

var o = {
  sin: Sin(10, false),
  saw: Saw(),
  sqr: Sqr(),
  tri: Tri(),
  ramp: Ramp(),
  noise: Noise(100)
};

var types = Object.keys(o);

export function dsp(t){
  return (
    osc.play(200 + (Math.sin(1 * t * Math.PI * 2) * 100)) * 0.3
  + o[types[3 * t % types.length | 0]](50) * .16
  )
}
