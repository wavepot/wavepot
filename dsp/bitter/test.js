
/**
 * test
 */
import Bitter from './index';

var notes = [440,880,220,660];
var patt  = [0,1];

export function dsp(t) {
  
  var synth = patt[Math.floor(((t+0.5)*4)%2)] * Math.sin( Math.PI * 2 * t * notes[Math.floor(t*2)%4] );
  var kick = Math.sin(t * (Math.exp(-(t / 2 % 0.25) * 120))) * Math.exp(-(t / 2 % 0.25) * 10);
  
  return Bitter(2).setPostGain(0.7).run(kick) 
       + Bitter(4 + Math.round(t%4) ).setPostGain(0.38).run( synth ) ;
}