
/**
 * test
 */

import kick from 'mwesselius/grotehangplek/master/percussion/percussion_samples/bd_oizokick1.wav';
import snare from 'jd-code/groovit/master/SAMPLES/SNAR_13D.WAV';
import hihat from 'pdv/webmpc/master/sounds/r909/909hat.wav';
import guitar from 'zillionk/AirInstruments/master/data/guitarAm.wav';

import Sampler from './index';

var drums = Sampler(8);

drums.tune(0.99);
drums.add('kick', kick);
drums.add('snare', snare);
drums.add('hihat', hihat);

var lead = Sampler(1);
lead.tune(1.1);
lead.add('guitar', guitar);

export function dsp(t){
  var out = 0;

  if ( (t*2)       % 1 === 0 ) drums.play('kick', 1);
  if ( (t+2/4)     % 1 === 0 ) drums.play('snare', 1, 1.1);
  if ( (t*2+2/4)   % 1 === 0 ) drums.play('hihat', 0.4, 1.5);

  if ( (t/4)       % 1 === 0 ) lead.play('guitar', 0.7, 1);
  if ( ((t+1/4)/4) % 1 === 0 ) lead.play('guitar', 0.7, 0.4);
  if ( ((t+3/4)/4) % 1 === 0 ) lead.play('guitar', 0.7, 2);

  out += drums.mix() + lead.mix();

  return out;
}
