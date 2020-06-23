import { note } from 'studio';
import { Tri } from 'studio';
import { envelope } from 'studio';
import { Sampler } from 'studio';

import kick from './drumkit/BTAA0D3.WAV';
import clap from './drumkit/HANDCLP1.WAV';
import snare from './drumkit/ST0T0S7.WAV';
import ohat from './drumkit/HHOD4.WAV';

import Step from './index';

var drums = Sampler(12);
drums.tune(1);
drums.add('kick', kick);
drums.add('clap', clap);
drums.add('snare', snare);
drums.add('ohat', ohat);

export let bpm = 125;

var step = Step(bpm);

var step_kick = step(1/4);
var step_kick_2 = step(2, 1/4+2/16);
var step_ohat = step(1/4, 1/8);
var step_snare = step(1/2, 1/4);
var step_clap = step(1, 1/4+1/8);
var step_clap_2 = step(1, 1/4+4/16);

export let drumbeat = [8, function drumbeat(t, f){
  if (step_kick(f)) drums.play('kick', .35, 1);
  if (step_kick_2(f)) drums.play('kick', .55, .7, true);
  if (step_ohat(f)) drums.play('ohat', .04, 1);
  if (step_snare(f)) drums.play('snare', .15, 1);
  if (step_clap(f)) drums.play('clap', .15, 1.9);
  if (step_clap_2(f)) drums.play('clap', .15, 2);
  return drums.mix();
}];

var bass_seq = ['c3','f3','d#3','d3'].map(note).map(f => f/2).reverse();
var bass_n = 0;
var step_bass = step(1/4, 4/16);

var tri = Tri(24);

export function bass(t, f){
  if (step_bass(f)) bass_n++;
  bass_n %= bass_seq.length;
  return tri(bass_seq[bass_n]) * envelope(t+4/16, 1/4, 10, 2);
}
