
/**
 * @module freeverb
 * @author stagas
 * @org opendsp
 * @desc freeverb reverb effect
 * @license mit
 */

import { sampleRate } from '../../settings.js'
import CombFilter from '../combfilter/index.js';
import Allpass from '../allpass/index.js';

export default Reverb;

var combs_a = [1116,1188,1277,1356].map(stretch);
var combs_b = [1422,1491,1557,1617].map(stretch);
var aps = [225,556,441,341].map(stretch);

function Reverb(){
  if (!(this instanceof Reverb)) return new Reverb();
  this.combs_a = combs_a.map(CombFilter);
  this.combs_b = combs_b.map(CombFilter);
  this.aps = aps.map(Allpass);
  this.room(0.5);
  this.damp(0.5);
}

Reverb.prototype.room = function(n){
  n = n * 0.28 + 0.7;
  this.combs_a.forEach(setProperty('feedback', n));
  this.combs_b.forEach(setProperty('feedback', n));
  return this;
};

Reverb.prototype.damp = function(n){
  n *= 0.4;
  this.combs_a.forEach(setProperty('damp', n));
  this.combs_b.forEach(setProperty('damp', n));
  return this;
};

Reverb.prototype.run = function(input, pc = .5){
  var output =
    this.combs_a.map(run).reduce(sum)
  + this.combs_b.map(run).reduce(sum)
  ;
  output = this.aps.reduce(waterfall, output);
  return output * pc + input * (1-pc);
  function run(el){ return el.run(input) }
};

function sum(p, n){
  return p + n;
}

function waterfall(p, n){
  return p + n.run(p);
}

function stretch(n){
  return n * (sampleRate / 44100) | 0;
}

function setProperty(key, value){
  return function(obj){
    obj[key] = value;
  };
}
