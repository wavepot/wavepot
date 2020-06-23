
/**
 * @module biquad
 * @author stagas
 * @desc biquad filter
 * @org opendsp
 * @credits mohayonao
 * @see http://mohayonao.github.io/timbre.js/
 * @license mit
 */

import { sampleRate } from '../../settings.js'

export default Biquad;

function Biquad(type){
  if (!(this instanceof Biquad)) return new Biquad(type);
  this.type = type || 'lpf';

  this.frequency = 340;
  this.Q = 1;
  this._gain = 1;

  this.reset();
  this.update();
}

Biquad.prototype.reset = function(){
  this.x1 = this.x2 = this.y1 = this.y2 = 0;
  this.b0 = this.b1 = this.b2 = this.a1 = this.a2 = 0;
};

Biquad.prototype.update = function(){
  filters[this.type].call(this, this.frequency, this.Q, this._gain);
  return this;
};

Biquad.prototype.run = function(x){
  var y = 0;

  var x1 = this.x1, x2 = this.x2, y1 = this.y1, y2 = this.y2;
  var b0 = this.b0, b1 = this.b1, b2 = this.b2, a1 = this.a1, a2 = this.a2;

  y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
  this.x2 = x1; this.x1 = x; this.y2 = y1; this.y1 = y;

  return y;
};

Biquad.prototype.cut = function(f){
  this.frequency = f;
  return this;
};

Biquad.prototype.res = function(q){
  this.Q = q;
  return this;
};

Biquad.prototype.gain = function(n){
  this._gain = n;
  return this;
};

var filters = {
  lowpass: function(cutoff, resonance){
    cutoff /= (sampleRate * 0.5);

    if (cutoff >= 1) {
      this.b0 = 1;
      this.b1 = this.b2 = this.a1 = this.a2 = 0;
    } else if (cutoff <= 0) {
      this.b0 = this.b1 = this.b2 = this.a1 = this.a2 = 0;
    } else {
      resonance = (resonance < 0) ? 0 : resonance;
      var g = Math.pow(10.0, 0.05 * resonance);
      var d = Math.sqrt((4 - Math.sqrt(16 - 16 / (g * g))) * 0.5);

      var theta = Math.PI * cutoff;
      var sn = 0.5 * d * Math.sin(theta);
      var beta = 0.5 * (1 - sn) / (1 + sn);
      var gamma = (0.5 + beta) * Math.cos(theta);
      var alpha = 0.25 * (0.5 + beta - gamma);

      this.b0 = 2 * alpha;
      this.b1 = 4 * alpha;
      this.b2 = this.b0; // 2 * alpha;
      this.a1 = 2 * -gamma;
      this.a2 = 2 * beta;
    }
  },
  highpass: function(cutoff, resonance){
    cutoff /= (sampleRate * 0.5);
    if (cutoff >= 1) {
      this.b0 = this.b1 = this.b2 = this.a1 = this.a2 = 0;
    } else if (cutoff <= 0) {
      this.b0 = 1;
      this.b1 = this.b2 = this.a1 = this.a2 = 0;
    } else {
      resonance = (resonance < 0) ? 0 : resonance;

      var g = Math.pow(10.0, 0.05 * resonance);
      var d = Math.sqrt((4 - Math.sqrt(16 - 16 / (g * g))) / 2);

      var theta = Math.PI * cutoff;
      var sn = 0.5 * d * Math.sin(theta);
      var beta = 0.5 * (1 - sn) / (1 + sn);
      var gamma = (0.5 + beta) * Math.cos(theta);
      var alpha = 0.25 * (0.5 + beta + gamma);

      this.b0 = 2 * alpha;
      this.b1 = -4 * alpha;
      this.b2 = this.b0; // 2 * alpha;
      this.a1 = 2 * -gamma;
      this.a2 = 2 * beta;
    }
  },
  bandpass: function(frequency, Q){
    frequency /= (sampleRate * 0.5);
    if (frequency > 0 && frequency < 1) {
      if (Q > 0) {
        var w0 = Math.PI * frequency;

        var alpha = Math.sin(w0) / (2 * Q);
        var k = Math.cos(w0);

        var ia0 = 1 / (1 + alpha);

        this.b0 = alpha * ia0;
        this.b1 = 0;
        this.b2 = -alpha * ia0;
        this.a1 = -2 * k * ia0;
        this.a2 = (1 - alpha) * ia0;
      } else {
        this.b0 = this.b1 = this.b2 = this.a1 = this.a2 = 0;
      }
    } else {
      this.b0 = this.b1 = this.b2 = this.a1 = this.a2 = 0;
    }
  },
  lowshelf: function(frequency, _dummy_, dbGain){
    frequency /= (sampleRate * 0.5);

    var A = Math.pow(10.0, dbGain / 40);

    if (frequency >= 1) {
      this.b0 = A* A;
      this.b1 = this.b2 = this.a1 = this.a2 = 0;
    } else if (frequency <= 0) {
      this.b0 = 1;
      this.b1 = this.b2 = this.a1 = this.a2 = 0;
    } else {
      var w0 = Math.PI * frequency;
      var S = 1; // filter slope (1 is max value)
      var alpha = 0.5 * Math.sin(w0) * Math.sqrt((A + 1 / A) * (1 / S - 1) + 2);
      var k = Math.cos(w0);
      var k2 = 2 * Math.sqrt(A) * alpha;
      var aPlusOne = A + 1;
      var aMinusOne = A - 1;

      var ia0 = 1 / (aPlusOne + aMinusOne * k + k2);

      this.b0 = (A * (aPlusOne - aMinusOne * k + k2)) * ia0;
      this.b1 = (2 * A * (aMinusOne - aPlusOne * k)) * ia0;
      this.b2 = (A * (aPlusOne - aMinusOne * k - k2)) * ia0;
      this.a1 = (-2 * (aMinusOne + aPlusOne * k)) * ia0;
      this.a2 = (aPlusOne + aMinusOne * k - k2) * ia0;
    }
  },
  highshelf: function(frequency, _dummy_, dbGain){
    frequency /= (sampleRate * 0.5);

    var A = Math.pow(10.0, dbGain / 40);

    if (frequency >= 1) {
      this.b0 = 1;
      this.b1 = this.b2 = this.a1 = this.a2 = 0;
    } else if (frequency <= 0) {
      this.b0 = A * A;
      this.b1 = this.b2 = this.a1 = this.a2 = 0;
    } else {
      var w0 = Math.PI * frequency;
      var S = 1; // filter slope (1 is max value)
      var alpha = 0.5 * Math.sin(w0) * Math.sqrt((A + 1 / A) * (1 / S - 1) + 2);
      var k = Math.cos(w0);
      var k2 = 2 * Math.sqrt(A) * alpha;
      var aPlusOne = A + 1;
      var aMinusOne = A - 1;

      var ia0 = 1 / (aPlusOne - aMinusOne * k + k2);

      this.b0 = (A * (aPlusOne + aMinusOne * k + k2)) * ia0;
      this.b1 = (-2 * A * (aMinusOne + aPlusOne * k)) * ia0;
      this.b2 = (A * (aPlusOne + aMinusOne * k - k2)) * ia0;
      this.a1 = (2 * (aMinusOne - aPlusOne * k)) * ia0;
      this.a2 = (aPlusOne - aMinusOne * k - k2) * ia0;
    }
  },
  peaking: function(frequency, Q, dbGain){
    frequency /= (sampleRate * 0.5);

    if (frequency > 0 && frequency < 1) {
      var A = Math.pow(10.0, dbGain / 40);
      if (Q > 0) {
        var w0 = Math.PI * frequency;
        var alpha = Math.sin(w0) / (2 * Q);
        var k = Math.cos(w0);
        var ia0 = 1 / (1 + alpha / A);

        this.b0 = (1 + alpha * A) * ia0;
        this.b1 = (-2 * k) * ia0;
        this.b2 = (1 - alpha * A) * ia0;
        this.a1 = this.b1; // (-2 * k) * ia0;
        this.a2 = (1 - alpha / A) * ia0;
      } else {
        this.b0 = A * A;
        this.b1 = this.b2 = this.a1 = this.a2 = 0;
      }
    } else {
        this.b0 = 1;
        this.b1 = this.b2 = this.a1 = this.a2 = 0;
    }
  },
  notch: function(frequency, Q){
    frequency /= (sampleRate * 0.5);

    if (frequency > 0 && frequency < 1) {
      if (Q > 0) {
        var w0 = Math.PI * frequency;
        var alpha = Math.sin(w0) / (2 * Q);
        var k = Math.cos(w0);
        var ia0 = 1 / (1 + alpha);

        this.b0 = ia0;
        this.b1 = (-2 * k) * ia0;
        this.b2 = ia0;
        this.a1 = this.b1; // (-2 * k) * ia0;
        this.a2 = (1 - alpha) * ia0;
      } else {
        this.b0 = this.b1 = this.b2 = this.a1 = this.a2 = 0;
      }
    } else {
      this.b0 = 1;
      this.b1 = this.b2 = this.a1 = this.a2 = 0;
    }
  },
  allpass: function(frequency, Q){
    frequency /= (sampleRate * 0.5);

    if (frequency > 0 && frequency < 1) {
      if (Q > 0) {
        var w0 = Math.PI * frequency;
        var alpha = Math.sin(w0) / (2 * Q);
        var k = Math.cos(w0);
        var ia0 = 1 / (1 + alpha);

        this.b0 = (1 - alpha) * ia0;
        this.b1 = (-2 * k) * ia0;
        this.b2 = (1 + alpha) * ia0;
        this.a1 = this.b1; // (-2 * k) * ia0;
        this.a2 = this.b0; // (1 - alpha) * ia0;
      } else {
        this.b0 = -1;
        this.b1 = this.b2 = this.a1 = this.a2 = 0;
      }
    } else {
      this.b0 = 1;
      this.b1 = this.b2 = this.a1 = this.a2 = 0;
    }
  }
};

filters.lpf = filters.lowpass;
filters.hpf = filters.highpass;
filters.bpf = filters.bandpass;
filters.bef = filters.notch;
filters.brf = filters.notch;
filters.apf = filters.allpass;
