
/**
 * @module moogladder
 * @author stagas
 * @desc moog ladder filter
 * @org opendsp
 * @credits Will Pirkle
 * @see http://www.willpirkle.com/project-gallery/app-notes/
 * @license mit
 */

import Filter from '../filter/index.js';
import prewarp from '../prewarp/index.js';

export default MoogLadder;

function MoogLadder(model){
  if (!(this instanceof MoogLadder)) return new MoogLadder(model);
  this.lpf1 = Filter('lpf');
  this.lpf2 = Filter('lpf');
  this.lpf3 = Filter('lpf');
  this.lpf4 = Filter('lpf');
  this.apf1 = Filter('apf');
  this.model = model || 'half';

  this.fc = 200;
  this.a = 0;
  this.k = 0.01;
  this.s = 1.0;
  this.nlp = true;
}

MoogLadder.prototype.reset = function(){
  this.lpf1.reset();
  this.lpf2.reset();
  this.lpf3.reset();
  this.lpf4.reset();
  this.apf1.reset();
};

MoogLadder.prototype.update = function(){
  var g = prewarp(this.fc);
  var G = g / (1 + g);

  if ('half' === this.model) {
		// the allpass G value
		var GA = 2.0*G-1;

		// set alphas
		this.lpf1.a = G;
		this.lpf2.a = G;
		this.apf1.a = G;

		// set beta feedback values
		this.lpf1.b = GA*G/(1.0+g);
		this.lpf2.b = GA/(1.0+g);
		this.apf1.b = 2.0/(1.0+g);

		// calculate alpha0
		// for 2nd order, K = 2 is max so limit it there
		var K = this.k;
		if (K > 2) K = 2;

		this.a = 1.0/(1.0 + K*GA*G*G);
  } else {
		// set alphas
		this.lpf1.a = G;
		this.lpf2.a = G;
		this.lpf3.a = G;
		this.lpf4.a = G;

		// set beta feedback values
		this.lpf1.b = G*G*G/(1.0+g);
		this.lpf2.b = G*G/(1.0+g);
		this.lpf3.b = G/(1.0+g);
		this.lpf4.b = 1.0/(1.0+g);

		// calculate alpha0
		// Gm = G^4
		this.a = 1.0/(1.0 + this.k*G*G*G*G);
  }

  return this;
};

MoogLadder.prototype.cut = function(fc){
  this.fc = fc;
  return this;
};

MoogLadder.prototype.res = function(k){
  this.k = k;
  return this;
};

MoogLadder.prototype.sat = function(s){
  this.s = s;
  return this;
};

MoogLadder.prototype.run = function(xn){
  var SM = 0;
  var y = 0;

  if ('half' === this.model) {
    SM =
      this.lpf1.getFeedbackOutput()
    + this.lpf2.getFeedbackOutput()
    + this.apf1.getFeedbackOutput()
    ;
  } else {
    SM =
      this.lpf1.getFeedbackOutput()
    + this.lpf2.getFeedbackOutput()
    + this.lpf3.getFeedbackOutput()
    + this.lpf4.getFeedbackOutput()
    ;
  }

  var K = this.k;
  if ('half' === this.model && K > 2) K = 2;

  var u = this.a * (xn - K*SM);

  if (this.nlp) {
    u = tanh(u * this.s);
  }

  if ('half' === this.model) {
		y = this.apf1.run(this.lpf2.run(this.lpf1.run(u)));
  } else {
		y = this.lpf4.run(this.lpf3.run(this.lpf2.run(this.lpf1.run(u))));
  }

  return y;
};

function tanh(x){
  x = Math.exp(2 * x);
  return (x - 1) / (x + 1);
}
