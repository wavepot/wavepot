
/**
 * test
 */

import Biquad from './index';
import { Saw } from 'opendsp/wavetable-osc';
import debug from 'debug';

var vcf = new Biquad('lpf');
var osc = Saw();

vcf
  .cut(700)
  .res(15)
  .gain(3)
  .update();

export function dsp(t){
  var out = osc(70);
  vcf.cut(600 + 500 * Math.sin(0.5 * t * Math.PI * 2));
  out = vcf.update().run(out);
  return out;
}
