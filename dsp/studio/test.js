// import { AdditiveOsc } from './index';

// var wav = AdditiveOsc('ramp');
// var oct = [1,2,1.5,2.5,1.75,2.25,1.25,1.5];
// var typ = ['sqr','tri','saw','ramp'];

// // export function additiveOsc(t) {
// //   wav
// //     .setType ( typ[Math.floor(t/4)%4])
// //     .setCycle( Math.floor(1+(t*4%16)));

// //   return 0.5* wav.play(t,140.5 * oct[Math.floor(t*2)%8] );
// // }

// import { Allpass } from './index.js';

// var ap = Allpass(3000);
// var dry, wet;

// var ch = 1;
// var out = [];
// var step = 0.5;

// // export function allpass(t) {
// //   if ((t*4) % step === 0) ch = 1 - ch;

// //   dry = Math.sin(440 * t * Math.PI * 2) * Math.exp(100 * (-t/2 % step));
// //   wet = ap.run(dry);

// //   out = 1.3 * dry + (ch ? wet : 0);

// //   return out;
// // }

// import { Biquad } from './index';
// import { Saw } from './index';

// var vcf = new Biquad('lpf');
// var osc = Saw();

// vcf
//   .cut(700)
//   .res(15)
//   .gain(3)
//   .update();

// // export function biquad(t){
// //   var out = osc(70);
// //   vcf.cut(600 + 500 * Math.sin(0.5 * t * Math.PI * 2));
// //   out = vcf.update().run(out);
// //   return out;
// // }

// import { Bitter } from './index';

// var notes = [440,880,220,660];
// var patt  = [0,1];

// // export function bitter(t) {

// //   var synth = patt[Math.floor(((t+0.5)*4)%2)] * Math.sin( Math.PI * 2 * t * notes[Math.floor(t*2)%4] );
// //   var kick = Math.sin(t * (Math.exp(-(t / 2 % 0.25) * 120))) * Math.exp(-(t / 2 % 0.25) * 10);

// //   return Bitter(2).setPostGain(0.7).run(kick)
// //        + Bitter(4 + Math.round(t%4) ).setPostGain(0.38).run( synth ) ;
// // }


/**
 * test
 */

// import { note } from './index';
// import { envelope as env } from './index';
// import { Tri, Saw, Sqr } from './index';
// import { sin } from './index';

// import { Chord } from './index';

// var base = oct(0.5);
// var chord = Chord(Saw, 16, true);
// var progr = [
//   ['f4','a4','c5','d#5'].map(note).map(base),
//   ['a4','c5','d#5','f5'].map(note).map(base),
//   ['c5','d#5','f5','a5'].map(note).map(base),
//   ['d#5','f5','a5','c6'].map(note).map(base),
// ];

// export function chordTest(t){
//   var kick = Math.sin(67 * env(t*2, 1/4, 28, 1.5));

//   var c = progr[3-(t%4|0)];

//   var mix = (
//     .5 * chord(c.map(vibrato(t,4,4))) * env(t+1/8, 1/16, 3, 2) * env(t+3/4, 1/4, 2, 1) * env(t+3/8, 1/2, 1, 3)
//   + .7 * kick
//   );

//   return mix;
// }

// function vibrato(t, f, n){
//   return function(x){
//     return x + (sin(t, f) * n);
//   };
// }

// function oct(x){
//   return function(f){
//     return f * x;
//   };
// }


import { note } from './index';
import { envelope as env } from './index';
import { Saw, Tri, Sqr } from './index';
import { Chord } from './index';
import { Chords } from './index';

var base = oct(6);
var chord = Chord(Saw, 36);
var progr = ['Bmaj7','Ebmaj9','F9','Abmin7'].map(Chords);

export function chords(t) {
  var c = progr[3-(t%4|0)];
  var vol = env(t*2, 1/6, 6, 4) * env(t+3/8, 1/4, 3, 1);
  return 1.5 * vol * chord(c.map(note).map(base), .2);
}

function oct(x){
  return function(y){
    return x * y;
  };
}
