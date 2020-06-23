
/**
 * @module diodefilter
 * @author stagas
 * @org opendsp
 * @desc diode filter
 * @license mit
 * @credits Dominique Wurtz
 */

import clip from '../softclip/index.js';

export default DiodeFilter;

function DiodeFilter(){
  if (!(this instanceof DiodeFilter)) return new DiodeFilter();
  this.k = 0;
  this.A = 0;
  this.z = new Float32Array([0,0,0,0,0]);
  this.ah;
  this.bh;
  this.fc;
  this.res(0);
  this.hpf(0.5);
  this.cut(0.5);
}

DiodeFilter.prototype.hpf = function(fc){
  var K = fc * Math.PI;
  this.ah = (K - 2) / (K + 2);
  this.bh = 2 / (K + 2);
  return this;
};

DiodeFilter.prototype.reset = function(){
  if (this.k < 17) this.z = new Float32Array([0,0,0,0,0]);
};

DiodeFilter.prototype.res = function(q){
  this.k = 20 * q;
  this.A = 1 + 0.5 * this.k;
  return this;
};

DiodeFilter.prototype.cut = function(cutoff){
  cutoff = (cutoff * cutoff);
  this.fc = cutoff <= 0
    ? 0.02
    : (cutoff >= 1.0 ? 0.999 : cutoff);
  return this;
};

DiodeFilter.prototype.run = function(x){
  var a = Math.PI * this.fc;
  a = 2 * Math.tan(0.5*a); // dewarping, not required with 2x oversampling
  var ainv = 1 / a;
  var a2 = a*a;
  var b = 2*a + 1;
  var b2 = b*b;
  var c = 1 / (2*a2*a2 - 4*a2*b2 + b2*b2);
  var g0 = 2*a2*a2*c;
  var g = g0 * this.bh;

  // current state
  var s0 = (a2*a*this.z[0] + a2*b*this.z[1] + this.z[2]*(b2 - 2*a2)*a + this.z[3]*(b2 - 3*a2)*b) * c;
  var s = this.bh*s0 - this.z[4];

  // solve feedback loop (linear)
  var y5 = (g*x + s) / (1 + g*this.k);

  // input clipping
  var y0 = clip(x - this.k*y5);
  y5 = g*y0 + s;

  // compute integrator outputs
  var y4 = g0*y0 + s0;
  var y3 = (b*y4 - this.z[3]) * ainv;
  var y2 = (b*y3 - a*y4 - this.z[2]) * ainv;
  var y1 = (b*y2 - a*y3 - this.z[1]) * ainv;

  // update filter state
  this.z[0] += 4*a*(y0 - y1 + y2);
  this.z[1] += 2*a*(y1 - 2*y2 + y3);
  this.z[2] += 2*a*(y2 - 2*y3 + y4);
  this.z[3] += 2*a*(y3 - 2*y4);
  this.z[4] = this.bh*y4 + this.ah*y5;

  return this.A*y4;
};
