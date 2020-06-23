
/**
 * @module korg35lpf
 * @author stagas
 * @desc korg35 lowpass filter
 * @org opendsp
 * @credits Will Pirkle
 * @see http://www.willpirkle.com/project-gallery/app-notes/
 * @license mit
 */

import Filter from 'filter';
import prewarp from 'prewarp';

export default Korg35LPF;

function Korg35LPF(){
  if (!(this instanceof Korg35LPF)) return new Korg35LPF();
  this.lpf1 = Filter('lpf');
  this.lpf2 = Filter('lpf');
  this.hpf1 = Filter('hpf');
  this.fc = 200;
  this.a = 0;
  this.k = 0.01;
  this._sat = 1.0;
  this.nlp = true;
}

Korg35LPF.prototype.reset = function(){
  this.lpf1.reset();
  this.lpf2.reset();
  this.hpf1.reset();
};

Korg35LPF.prototype.update = function(){
  var g = prewarp(this.fc);
  var G = g / (1 + g);
  var k = this.k;

  this.lpf1.a = G;
  this.lpf2.a = G;
  this.hpf1.a = G;

  this.lpf2.b = (k-k*G)/(1+g);
  this.hpf1.b = -1/(1 + g);

  this.a = 1/(1-k*G+k*G*G);
};

Korg35LPF.prototype.cut = function(fc){
  this.fc = fc;
  this.update();
  return this;
};

Korg35LPF.prototype.res = function(k){
  this.k = k;
  return this;
};

Korg35LPF.prototype.sat = function(n){
  this._sat = n;
  return this;
};

Korg35LPF.prototype.run = function(xn){
  var y1 = this.lpf1.run(xn);
  var S35 = this.hpf1.getFeedbackOutput() + this.lpf2.getFeedbackOutput();

  var u = this.a * (y1 + S35);

  if (this.nlp) {
    u = tanh(this._sat * u);
  }

  var y = this.k * this.lpf2.run(u);

  this.hpf1.run(y);

  if (this.k > 0) y *= 1/this.k;

  return y;
};

function tanh(x){
  x = Math.exp(2 * x);
  return (x - 1) / (x + 1);
}
