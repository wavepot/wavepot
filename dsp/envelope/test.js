
/**
 * test
 */

import envelope from './index.js';
import { Tri } from 'opendsp/wavetable-osc';

var a = Tri();
var b = Tri();

export function dsp(t) {
  t *= 2;
  return (
    a(260) * envelope(t, 1/4, 7, 9) * 0.5
  + b(200) * envelope(t-1/2, 1/2, 5, 10) * 0.5
  );
}
