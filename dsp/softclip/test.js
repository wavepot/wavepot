
/**
 * test
 */

import { Saw } from 'opendsp/wavetable-osc';
import debug from 'debug';
import clip from './index.js';

debug(clip(1, 0.6));
assert(0.5===clip(1));
assert(-0.5===clip(-1));
assert(0.625===clip(1,0.6));
assert(-0.625===clip(-1,0.6));
assert(0.9375===clip(15));
assert(-0.9375===clip(-15));

var step = 0.2;
var osc = Saw();
var lfo = 0;
var dry, wet;

export function dsp(t){
  lfo = Math.sin(0.3 * Math.PI * 2 * t) + 1;
  dry = osc(93.75)
      * Math.exp(1 * (-t/2 % step));

  wet = clip(dry * 8, lfo + 0.01);

  debug(wet.toFixed(5));

  return wet * 0.4;
}

function assert(expr, msg){
  if (!expr) throw new Error(msg || 'failed');
  return expr;
}
