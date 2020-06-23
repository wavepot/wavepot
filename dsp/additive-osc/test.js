
/**
 * test
 */

import Osc from './index';

var wav = Osc('ramp');
var oct = [1,2,1.5,2.5,1.75,2.25,1.25,1.5];
var typ = ['sqr','tri','saw','ramp'];

export function dsp(t) {

  wav
    .setType ( typ[Math.floor(t/4)%4])
    .setCycle( Math.floor(1+(t*4%16)));
  
  return 0.5* wav.play(t,140.5 * oct[Math.floor(t*2)%8] );
}