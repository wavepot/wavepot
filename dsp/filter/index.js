
/**
 * @module filter
 * @author stagas
 * @version 2.0.0
 * @org opendsp
 * @desc one pole filter
 * @credits Will Pirkle
 * @see http://www.willpirkle.com/project-gallery/app-notes/
 * @license mit
 */

import prewarp from '../prewarp/index.js';

export default OnePoleFilter;

function OnePoleFilter(type){
  if (!(this instanceof OnePoleFilter)) return new OnePoleFilter(type);
  this.type = type || 'lpf';
  this.out = {
    type: this.type,
    valueOf: function(){ return this[this.type] }
  };
  this.fc = 200;
  this.a = 1;
  this.b = 1;
  this.reset();
  this.update();
}

OnePoleFilter.prototype.reset = function(){
  this.z1 = 0;
};

OnePoleFilter.prototype.getFeedbackOutput = function(){
  return this.z1 * this.b;
};

OnePoleFilter.prototype.update = function(){
  var wa = prewarp(this.fc);
  this.a = wa / (1.0 + wa);
};

OnePoleFilter.prototype.cut = function(fc){
  this.fc = fc;
  this.update();
  return this;
};

OnePoleFilter.prototype.run = function(xn){
  var out = this.out;
  var vn = (xn - this.z1) * this.a;
  out.lpf = vn + this.z1;
  this.z1 = vn + out.lpf;
  out.hpf = xn - out.lpf;
  out.apf = out.lpf - out.hpf;
  return out;
};
