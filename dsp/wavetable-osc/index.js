
/**
 * @module wavetable-osc
 * @author stagas
 * @org opendsp
 * @license mit
 */

// export default Oscillator;

/**
 * Creates a wavetable oscillator for wave `type` and sample `size`.
 * Optionally pass `alias=false` to disable playback waveform aliasing.
 *
 * @param {String} type
 * @param {Number} size (optional)
 * @param {Boolean} alias (optional)
 * @public
 * @class
 */

function Oscillator({ sampleRate }, type, size, alias, phase = 0){
  if (!(this instanceof Oscillator)) return new Oscillator({ sampleRate }, type, size, alias, phase);
  this.size = size || sampleRate;
  this.phase = phase;
  this.pos = phase * this.size;
  this.coeff = this.size / sampleRate;
  this.table = new Float32Array(this.size);
  this.alias = alias === false ? false : true;
  this.build(type);
}

Oscillator.prototype.reset = function() {
  this.pos = this.phase * this.size
}

/**
 * Builds wavetable of wave `type`.
 *
 * @param {String} type
 * @private
 */

Oscillator.prototype.build = function(type){
  switch (type) {
    case 'sin':
      var scale = 2 * Math.PI / this.size;
      for (var i = 0; i < this.size; i++) {
        this.table[i] = Math.sin(i * scale);
      }
      break;

    case 'saw':
      for (var i = 0; i < this.size; i++) {
        var x = (i / this.size);
        this.table[i] = +2.0 * (x - Math.round(x));
      }
      break;

    case 'sqr':
      var half = this.size / 2;
      for (var i = 0; i < this.size; i++) {
        this.table[i] = i < half ? +1 : -1;
      }
      break;

    case 'tri':
      for (var i = 0; i < this.size; i++) {
        var x = (i / this.size) - 0.25;
        this.table[i] = 1.0 - 4.0 * Math.abs(Math.round(x) - x);
      }
      break;

    case 'ramp':
      for (var i = 0; i < this.size; i++) {
        var x = (i / this.size);
        this.table[i] = -2.0 * (x - Math.round(x));
      }
      break;

    case 'noise':
      for (var i = 0; i < this.size; i++) {
        this.table[i] = 1 - Math.random() * 2;
      }
      break;
  }
};

/**
 * Generates next sample for frequency `freq`.
 *
 * @param {Number} freq
 * @return {Number}
 * @public
 */

Oscillator.prototype.play = function(freq){
  this.pos += freq * this.coeff;
  if (this.pos >= this.size) this.pos -= this.size;
  this.index = this.pos | 0;
  if (!this.alias) return this.table[this.index];
  this.alpha = this.pos - this.index;
  this.next = this.table[this.index == this.size - 1 ? 0 : this.index + 1];
  this.curr = this.table[this.index];
  return this.curr + (this.next - this.curr) * this.alpha;
};

/**
 * Create oscillator factories for all available wave types.
 */

// export var Sin = factory('sin');
// export var Saw = factory('saw');
// export var Sqr = factory('sqr');
// export var Tri = factory('tri');
// export var Ramp = factory('ramp');
// export var Noise = factory('noise');

/**
 * Creates an Oscillator factory currying `type`.
 *
 * @param {String} type
 * @return {Function}
 * @private
 */

export default function factory(context, type, size, alias, phase){
  var osc = Oscillator(context, type, size, alias, phase);
  var play = osc.play.bind(osc)
  play.reset = osc.reset.bind(osc)
  return play;
}
