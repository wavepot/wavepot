
/**
 * test
 */

import { sin, saw, ramp, tri, sqr, pulse, noise } from './index';

export function dsp(t){
  //return pulse(t, 70, sin(t, .1)+1);
  //return (sqr(t, .1) + sin(t, .1)) / 3;
  return [sin, saw, ramp, tri, sqr, pulse, noise][2*t%6|0](t, 300, 0.5) * 0.4;
}
