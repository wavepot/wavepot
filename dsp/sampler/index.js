
/**
 * @module sampler
 * @author stagas
 * @desc sampler
 * @license mit
 */

import { sampleRate } from '../../settings.js'

export default Sampler;

export function Sampler(n){
  if (!(this instanceof Sampler)) return new Sampler(n);
  this.voices = Array(n || 4);
  this.voice = 0;
  this.coeff = 0;
  this.bank = {};
}

Sampler.prototype.add = function(key, sample){
  this.bank[key] = Sample(sample);
  return this;
};

Sampler.prototype.tune = function(n){
  this.coeff = n;
  return this;
};

Sampler.prototype.play = function(key, vol, speed){
  this.voices[this.voice++] = {
    sample: Sample(this.bank[key]),
    vol: vol || 1,
    speed: (speed || 1) * this.coeff
  };
  if (this.voice === this.voices.length) this.voice = 0;
  return this;
};

Sampler.prototype.mix = function(){
  return this.voices.reduce(sum, 0);
};

export function Sample(buffer){
  var header, floats;

  if (buffer.floats) {
    floats = buffer.floats;
  } else {
    floats = wavToFloat32Array(buffer);
    header = new DataView(buffer, 0, 44);
    floats.sampleRate = header.getUint32(24, true);
  }

  var len = floats.length;
  var i = 0;
  var s = 0;

  play.play = play;
  play.floats = floats;

  var coeff = floats.sampleRate / sampleRate;

  return play;

  function play(speed){
    if (i > len) return 0;
    s = floats[i|0];
    i += (speed || 1) * coeff;
    return isNaN(s) ? 0 : s;
  }
}

export function wavToFloat32Array(buffer){
  var view = new DataView(buffer, 44);
  var len = view.byteLength / 2;
  var floats = new Float32Array(len);
  for (var i = 0; i < view.byteLength; i += 2) {
    var s = view.getUint16(i, true);
    if (s > 32767) {
      s -= 65536;
    }
    s /= 32768;
    floats[i/2] = s;
  }
  return floats;
}

function sum(p, n){
  return p + n.sample(n.speed) * n.vol;
}
