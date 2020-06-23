
/**
 * test
 */

import { sin } from 'opendsp/osc';
import note from './index';

//c,c#,d,d#,e,f,f#,g,g#,a,a#,b
assert(note(1) === note('c#0'));
assert(note(12) === note('c1'));
assert(note(9) === 27.5);
assert(note('a1') === 55);
assert(note('b2').toFixed(3) === '123.471');
assert(note('e3').toFixed(3) === '164.814');
assert(note('f#3').toFixed(3) === '184.997');
assert(note('gb3').toFixed(3) === '184.997');
assert(note(9 + 12 * 3) === 220);
assert(note('a4') === 440);
assert(note('a5') === 880);
assert(note('d5').toFixed(3) === '587.330');

export function dsp(t){
  return sin(t, note('e3')) * 0.5;
}

function assert(expr){ if (!expr) throw new Error('failed') }
