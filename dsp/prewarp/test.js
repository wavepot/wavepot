
/**
 * test
 */

import debug from 'debug';
import prewarp from './index';

var out = 0;

var w = prewarp(0);
var a = w / (1 + w);
out += a.toFixed(1)==='0.0';

var w = prewarp(sampleRate/4);
var a = w / (1 + w);
out += a.toFixed(1)==='0.5';

var w = prewarp(sampleRate/2);
var a = w / (1 + w);
out += a.toFixed(1)==='1.0';

debug(3 === out && 'all tests pass');

export function dsp(t){
  return 0;
}
