(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.studio = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _additiveOsc = require('additive-osc');

Object.defineProperty(exports, 'AdditiveOsc', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_additiveOsc).default;
  }
});

var _allpass = require('allpass');

Object.defineProperty(exports, 'Allpass', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_allpass).default;
  }
});

var _biquad = require('biquad');

Object.defineProperty(exports, 'Biquad', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_biquad).default;
  }
});

var _bitter = require('bitter');

Object.defineProperty(exports, 'Bitter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_bitter).default;
  }
});

var _chord = require('chord');

Object.defineProperty(exports, 'Chord', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_chord).default;
  }
});

var _chords = require('chords');

Object.defineProperty(exports, 'Chords', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_chords).default;
  }
});

var _chordsOf = require('chords-of');

Object.defineProperty(exports, 'chordsOf', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_chordsOf).default;
  }
});

var _combfilter = require('combfilter');

Object.defineProperty(exports, 'CombFilter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_combfilter).default;
  }
});

var _delay = require('delay');

Object.defineProperty(exports, 'Delay', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_delay).default;
  }
});

var _diodefilter = require('diodefilter');

Object.defineProperty(exports, 'DiodeFilter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_diodefilter).default;
  }
});

var _envelope = require('envelope');

Object.defineProperty(exports, 'envelope', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_envelope).default;
  }
});

var _filter = require('filter');

Object.defineProperty(exports, 'Filter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_filter).default;
  }
});

var _freeverb = require('freeverb');

Object.defineProperty(exports, 'FreeVerb', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_freeverb).default;
  }
});

var _korg35lpf = require('korg35lpf');

Object.defineProperty(exports, 'Korg35LPF', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_korg35lpf).default;
  }
});

var _moogladder = require('moogladder');

Object.defineProperty(exports, 'MoogLadder', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_moogladder).default;
  }
});

var _nopop = require('nopop');

Object.defineProperty(exports, 'Nopop', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_nopop).default;
  }
});

var _note = require('note');

Object.defineProperty(exports, 'note', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_note).default;
  }
});

var _sampler = require('sampler');

Object.defineProperty(exports, 'Sampler', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_sampler).default;
  }
});

var _scales = require('scales');

Object.defineProperty(exports, 'scales', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_scales).default;
  }
});

var _softclip = require('softclip');

Object.defineProperty(exports, 'softClip', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_softclip).default;
  }
});

var _step = require('step');

Object.defineProperty(exports, 'Step', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_step).default;
  }
});

var _osc = require('osc');

Object.keys(_osc).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _osc[key];
    }
  });
});

var _wavetableOsc = require('wavetable-osc');

Object.keys(_wavetableOsc).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _wavetableOsc[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"additive-osc":2,"allpass":3,"biquad":4,"bitter":5,"chord":6,"chords":8,"chords-of":7,"combfilter":9,"delay":10,"diodefilter":11,"envelope":13,"filter":14,"freeverb":15,"korg35lpf":18,"moogladder":20,"nopop":22,"note":23,"osc":24,"sampler":26,"scales":27,"softclip":28,"step":29,"wavetable-osc":30}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * @module additive-osc
 * @org opendsp
 * @author potasmic
 * @version 0.1.1
 * @desc additive oscillators
 * @license mit
 */

exports.default = Osc;


function Osc(type, cyc) {
  if (!(this instanceof Osc)) return new Osc(type, cyc);
  this.iter = cyc || 16;
  this.type = type;
  this.config(type);
}

Osc.prototype.config = function (type) {
  switch (type) {
    case 'sqr':
      this.a = 4 / Math.PI;
      this.s = 1;

      this.l = function (k, freq, t) {
        return Math.sin(2 * Math.PI * (2 * k - 1) * freq * t) / (2 * k - 1);
      };
      break;
    case 'tri':
      this.a = 8 / Math.pow(Math.PI, 2);
      this.s = 0;

      this.l = function (k, freq, t) {
        return Math.pow(-1, k) * Math.sin(2 * Math.PI * (2 * k + 1) * freq * t) / Math.pow(2 * k + 1, 2);
      };
      break;
    case 'saw':
      this.a = 2 / Math.PI;
      this.s = 1;

      this.l = function (k, freq, t) {
        return Math.pow(-1, k) * Math.sin(2 * Math.PI * k * freq * t) / k;
      };
      break;
    case 'ramp':
      this.a = -2 / Math.PI;
      this.s = 1;

      this.l = function (k, freq, t) {
        return Math.sin(2 * Math.PI * k * freq * t) / k;
      };
      break;
  }
};

function cycle(k, f, t, a, num, denom) {
  return a(k) * num(k, f, t) / denom(k);
}

Osc.prototype.play = function (t, freq) {
  var sum = 0;

  for (var k = this.s; k <= this.iter; k++) {
    sum += this.l(k, freq, t);
  }
  return this.a * sum;
};

Osc.prototype.setCycle = function (cyc) {
  this.iter = cyc;
  return this;
};

Osc.prototype.setType = function (type) {
  this.type = type;
  this.config(type);
  return this;
};

var Sqr = exports.Sqr = Osc('sqr');
var Tri = exports.Tri = Osc('tri');
var Saw = exports.Saw = Osc('saw');

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * @module allpass
 * @author stagas
 * @org opendsp
 * @desc allpass filter
 * @license mit
 */

exports.default = Allpass;


function Allpass(size) {
  if (!(this instanceof Allpass)) return new Allpass(size);
  this.size = size;
  this.index = 0;
  this.buffer = new Float32Array(size);
}

Allpass.prototype.run = function (input) {
  var sample = this.buffer[this.index];
  var output = -input + sample;
  this.buffer[this.index] = input + sample * 0.5;
  if (++this.index === this.size) this.index = 0;
  return output;
};

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * @module biquad
 * @author stagas
 * @desc biquad filter
 * @org opendsp
 * @credits mohayonao
 * @see http://mohayonao.github.io/timbre.js/
 * @license mit
 */

exports.default = Biquad;


function Biquad(type) {
  if (!(this instanceof Biquad)) return new Biquad(type);
  this.type = type || 'lpf';

  this.frequency = 340;
  this.Q = 1;
  this._gain = 1;

  this.reset();
  this.update();
}

Biquad.prototype.reset = function () {
  this.x1 = this.x2 = this.y1 = this.y2 = 0;
  this.b0 = this.b1 = this.b2 = this.a1 = this.a2 = 0;
};

Biquad.prototype.update = function () {
  filters[this.type].call(this, this.frequency, this.Q, this._gain);
  return this;
};

Biquad.prototype.run = function (x) {
  var y = 0;

  var x1 = this.x1,
      x2 = this.x2,
      y1 = this.y1,
      y2 = this.y2;
  var b0 = this.b0,
      b1 = this.b1,
      b2 = this.b2,
      a1 = this.a1,
      a2 = this.a2;

  y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
  this.x2 = x1;this.x1 = x;this.y2 = y1;this.y1 = y;

  return y;
};

Biquad.prototype.cut = function (f) {
  this.frequency = f;
  return this;
};

Biquad.prototype.res = function (q) {
  this.Q = q;
  return this;
};

Biquad.prototype.gain = function (n) {
  this._gain = n;
  return this;
};

var filters = {
  lowpass: function lowpass(cutoff, resonance) {
    cutoff /= sampleRate * 0.5;

    if (cutoff >= 1) {
      this.b0 = 1;
      this.b1 = this.b2 = this.a1 = this.a2 = 0;
    } else if (cutoff <= 0) {
      this.b0 = this.b1 = this.b2 = this.a1 = this.a2 = 0;
    } else {
      resonance = resonance < 0 ? 0 : resonance;
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
  highpass: function highpass(cutoff, resonance) {
    cutoff /= sampleRate * 0.5;
    if (cutoff >= 1) {
      this.b0 = this.b1 = this.b2 = this.a1 = this.a2 = 0;
    } else if (cutoff <= 0) {
      this.b0 = 1;
      this.b1 = this.b2 = this.a1 = this.a2 = 0;
    } else {
      resonance = resonance < 0 ? 0 : resonance;

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
  bandpass: function bandpass(frequency, Q) {
    frequency /= sampleRate * 0.5;
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
  lowshelf: function lowshelf(frequency, _dummy_, dbGain) {
    frequency /= sampleRate * 0.5;

    var A = Math.pow(10.0, dbGain / 40);

    if (frequency >= 1) {
      this.b0 = A * A;
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

      this.b0 = A * (aPlusOne - aMinusOne * k + k2) * ia0;
      this.b1 = 2 * A * (aMinusOne - aPlusOne * k) * ia0;
      this.b2 = A * (aPlusOne - aMinusOne * k - k2) * ia0;
      this.a1 = -2 * (aMinusOne + aPlusOne * k) * ia0;
      this.a2 = (aPlusOne + aMinusOne * k - k2) * ia0;
    }
  },
  highshelf: function highshelf(frequency, _dummy_, dbGain) {
    frequency /= sampleRate * 0.5;

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

      this.b0 = A * (aPlusOne + aMinusOne * k + k2) * ia0;
      this.b1 = -2 * A * (aMinusOne + aPlusOne * k) * ia0;
      this.b2 = A * (aPlusOne + aMinusOne * k - k2) * ia0;
      this.a1 = 2 * (aMinusOne - aPlusOne * k) * ia0;
      this.a2 = (aPlusOne - aMinusOne * k - k2) * ia0;
    }
  },
  peaking: function peaking(frequency, Q, dbGain) {
    frequency /= sampleRate * 0.5;

    if (frequency > 0 && frequency < 1) {
      var A = Math.pow(10.0, dbGain / 40);
      if (Q > 0) {
        var w0 = Math.PI * frequency;
        var alpha = Math.sin(w0) / (2 * Q);
        var k = Math.cos(w0);
        var ia0 = 1 / (1 + alpha / A);

        this.b0 = (1 + alpha * A) * ia0;
        this.b1 = -2 * k * ia0;
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
  notch: function notch(frequency, Q) {
    frequency /= sampleRate * 0.5;

    if (frequency > 0 && frequency < 1) {
      if (Q > 0) {
        var w0 = Math.PI * frequency;
        var alpha = Math.sin(w0) / (2 * Q);
        var k = Math.cos(w0);
        var ia0 = 1 / (1 + alpha);

        this.b0 = ia0;
        this.b1 = -2 * k * ia0;
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
  allpass: function allpass(frequency, Q) {
    frequency /= sampleRate * 0.5;

    if (frequency > 0 && frequency < 1) {
      if (Q > 0) {
        var w0 = Math.PI * frequency;
        var alpha = Math.sin(w0) / (2 * Q);
        var k = Math.cos(w0);
        var ia0 = 1 / (1 + alpha);

        this.b0 = (1 - alpha) * ia0;
        this.b1 = -2 * k * ia0;
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

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * @module bitter
 * @author potasmic
 * @org opendsp
 * @version 0.0.1
 * @desc Bit-Depth Reduction
 * @license mit
 */

/**
 * This module reduces the bit-depth of the input signal
 * Check out this article on Wikipedia about bit-depth in audio: 
 * https://en.wikipedia.org/wiki/Audio_bit_depth
 * 
 * For n bit-depth, we have 2^n possible values for a sample.
 * For example, if the bit-depth is 8, we have 256 possible values ranging from -128 to 127
 * 
 */

exports.default = Bitter;


function Bitter(dep) {
  if (!(this instanceof Bitter)) return new Bitter(dep);
  this.depth = dep > 0 ? parseInt(dep) : 8;
  this.preGain = 1;
  this.postGain = 1;
  return this;
}

Bitter.prototype.run = function (input) {
  return this.postGain * (Math.round(this.preGain * input * this.depth) / this.depth);
};

Bitter.prototype.setDepth = function (n) {
  this.depth = parseInt(Math.abs(n));
  return this;
};

Bitter.prototype.setPreGain = function (k) {
  this.preGain = k;
  return this;
};

Bitter.prototype.setPostGain = function (k) {
  this.postGain = k;
  return this;
};

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Chord;

/**
 * @module chord
 * @author stagas
 * @desc chord player
 * @version 1.1.0
 * @license mit
 */

function Chord(Osc, a, b, c, d, e) {
  var voices = '1234567'.split('').map(function () {
    return Osc(a, b, c, d, e);
  });
  var play = Play(voices);
  return function (notes, vel) {
    return notes.map(play(vel)).reduce(sum);
  };
}

function Play(voices) {
  return function (vel) {
    vel = vel || 0.1;
    return function (f, i) {
      return voices[i](f) * (1 - i * vel);
    };
  };
}

function sum(p, n) {
  return (p + n) / 2;
}

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (scale, voices) {
  var chords = {};
  var s = scale.concat(scale.map(oct(1))).concat(scale.map(oct(2)));
  voices = voices || 3;

  for (var n in roman) {
    n = +n;
    var c = chords[roman[n]] = chords[roman[n].toUpperCase()] = [];
    for (var i = n; i < n + voices * 2; i += 2) {
      c.push(s[i - 1]);
    }
  }

  return chords;
};

/**
 * @module chords-of
 * @author stagas
 * @version 1.0.0
 * @desc generate all chords of a scale
 * @license mit
 */

var roman = {
  1: 'i',
  2: 'ii',
  3: 'iii',
  4: 'iv',
  5: 'v',
  6: 'vi',
  7: 'vii'
};

function oct(x) {
  return function (y) {
    return y + x * 12;
  };
}

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * @module chords
 * @author stagas
 * @desc chord generator
 * @version 1.0.1
 * @license mit
 */

exports.default = Chords;


var notes = 'ccddeffggaab';

function Chords(s) {
  var n = s[0].toLowerCase();
  var note = notes.indexOf(n);
  var flat = s[1] === 'b';
  var sharp = s[1] === '#';
  var semi = transpose(note + sharp - flat);
  var name = s.slice(!sharp && !flat ? 1 : 2);
  if (!name.length) name = 'maj';
  var c = chords[name];
  return c.map(semi);
}

var chords = Chords.chords = {
  '1': [0],
  '5': [0, 7],
  'maj': [0, 4, 7],
  'min': [0, 3, 7], 'm': [0, 3, 7],
  'sus4': [0, 5, 7], 'sus2': [0, 2, 7],
  'aug': [0, 4, 8], 'minmaj7': [0, 3, 7, 11],
  'dim': [0, 3, 6], 'hdim7': [0, 3, 6, 10], 'dim7': [0, 3, 6, 9],
  'maj6': [0, 4, 7, 9], 'min6': [0, 3, 7, 9],
  'maj7': [0, 4, 7, 11], 'min7': [0, 3, 7, 10], '7': [0, 4, 7, 10],
  'maj9': [0, 4, 7, 11, 14], '9': [0, 4, 7, 10, 14], 'min9': [0, 3, 7, 10, 14],
  'maj11': [0, 4, 7, 11, 14, 17], '11': [0, 4, 7, 10, 14, 17], 'min11': [0, 3, 7, 10, 14, 17],
  'maj13': [0, 4, 7, 11, 14, 17, 21], '13': [0, 4, 7, 10, 14, 17, 21], 'min13': [0, 3, 7, 10, 14, 17, 21]
};

function transpose(x) {
  return function (y) {
    return x + y;
  };
}

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * @module combfilter
 * @author stagas
 * @org opendsp
 * @desc comb filter
 * @license mit
 */

exports.default = CombFilter;


function CombFilter(size) {
  if (!(this instanceof CombFilter)) return new CombFilter(size);
  this.size = size;
  this.index = 0;
  this.buffer = new Float32Array(size);
  this.feedback = 0;
  this.filter = 0;
  this.damp = 0;
}

CombFilter.prototype.run = function (input) {
  var output = this.buffer[this.index];
  this.filter = output * (1 - this.damp) + this.filter * this.damp;
  this.buffer[this.index] = input * 0.015 + this.filter * this.feedback;
  if (++this.index === this.size) this.index = 0;
  return output;
};

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * @module delay
 * @author stagas
 * @org opendsp
 * @desc delay
 * @see http://www.musicdsp.org/showone.php?id=98
 * @license mit
 */

exports.default = Delay;


function Delay(size) {
  if (!(this instanceof Delay)) return new Delay(size);
  size = size || 512;
  this.buffer = new Float32Array(size);
  this.size = size;
  this.counter = 0;
  this._feedback = 0.5;
  this._delay = 100;
}

Delay.prototype.feedback = function (n) {
  this._feedback = n;
  return this;
};

Delay.prototype.delay = function (n) {
  this._delay = n;
  return this;
};

Delay.prototype.run = function (inp) {
  var back = this.counter - this._delay;
  if (back < 0) back = this.size + back;
  var index0 = Math.floor(back);

  var index_1 = index0 - 1;
  var index1 = index0 + 1;
  var index2 = index0 + 2;

  if (index_1 < 0) index_1 = this.size - 1;
  if (index1 >= this.size) index1 = 0;
  if (index2 >= this.size) index2 = 0;

  var y_1 = this.buffer[index_1];
  var y0 = this.buffer[index0];
  var y1 = this.buffer[index1];
  var y2 = this.buffer[index2];

  var x = back - index0;

  var c0 = y0;
  var c1 = 0.5 * (y1 - y_1);
  var c2 = y_1 - 2.5 * y0 + 2.0 * y1 - 0.5 * y2;
  var c3 = 0.5 * (y2 - y_1) + 1.5 * (y0 - y1);

  var out = ((c3 * x + c2) * x + c1) * x + c0;

  this.buffer[this.counter] = inp + out * this._feedback;

  this.counter++;

  if (this.counter >= this.size) this.counter = 0;

  return out;
};

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _softclip = require('softclip');

var _softclip2 = _interopRequireDefault(_softclip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = DiodeFilter;
/**
 * @module diodefilter
 * @author stagas
 * @org opendsp
 * @desc diode filter
 * @license mit
 * @credits Dominique Wurtz
 */

function DiodeFilter() {
  if (!(this instanceof DiodeFilter)) return new DiodeFilter();
  this.k = 0;
  this.A = 0;
  this.z = new Float32Array([0, 0, 0, 0, 0]);
  this.ah;
  this.bh;
  this.fc;
  this.res(0);
  this.hpf(0.5);
  this.cut(0.5);
}

DiodeFilter.prototype.hpf = function (fc) {
  var K = fc * Math.PI;
  this.ah = (K - 2) / (K + 2);
  this.bh = 2 / (K + 2);
  return this;
};

DiodeFilter.prototype.reset = function () {
  if (this.k < 17) this.z = new Float32Array([0, 0, 0, 0, 0]);
};

DiodeFilter.prototype.res = function (q) {
  this.k = 20 * q;
  this.A = 1 + 0.5 * this.k;
  return this;
};

DiodeFilter.prototype.cut = function (cutoff) {
  cutoff = cutoff * cutoff;
  this.fc = cutoff <= 0 ? 0.02 : cutoff >= 1.0 ? 0.999 : cutoff;
  return this;
};

DiodeFilter.prototype.run = function (x) {
  var a = Math.PI * this.fc;
  a = 2 * Math.tan(0.5 * a); // dewarping, not required with 2x oversampling
  var ainv = 1 / a;
  var a2 = a * a;
  var b = 2 * a + 1;
  var b2 = b * b;
  var c = 1 / (2 * a2 * a2 - 4 * a2 * b2 + b2 * b2);
  var g0 = 2 * a2 * a2 * c;
  var g = g0 * this.bh;

  // current state
  var s0 = (a2 * a * this.z[0] + a2 * b * this.z[1] + this.z[2] * (b2 - 2 * a2) * a + this.z[3] * (b2 - 3 * a2) * b) * c;
  var s = this.bh * s0 - this.z[4];

  // solve feedback loop (linear)
  var y5 = (g * x + s) / (1 + g * this.k);

  // input clipping
  var y0 = (0, _softclip2.default)(x - this.k * y5);
  y5 = g * y0 + s;

  // compute integrator outputs
  var y4 = g0 * y0 + s0;
  var y3 = (b * y4 - this.z[3]) * ainv;
  var y2 = (b * y3 - a * y4 - this.z[2]) * ainv;
  var y1 = (b * y2 - a * y3 - this.z[1]) * ainv;

  // update filter state
  this.z[0] += 4 * a * (y0 - y1 + y2);
  this.z[1] += 2 * a * (y1 - 2 * y2 + y3);
  this.z[2] += 2 * a * (y2 - 2 * y3 + y4);
  this.z[3] += 2 * a * (y3 - 2 * y4);
  this.z[4] = this.bh * y4 + this.ah * y5;

  return this.A * y4;
};

},{"softclip":12}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = clip;

/**
 * @module softclip
 * @author stagas
 * @org opendsp
 * @desc soft clip
 * @license mit
 */

function clip(x, amt) {
  return x / ((amt || 1) + Math.abs(x));
}

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = envelope;

/**
 * @module envelope
 * @author stagas
 * @org opendsp
 * @desc envelope
 * @license mit
 */

function envelope(t, measure, decay, release) {
  var ts = t / 4 % measure;
  return Math.exp(-ts * decay * Math.exp(ts * release));
}

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _prewarp = require('prewarp');

var _prewarp2 = _interopRequireDefault(_prewarp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = OnePoleFilter;
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

function OnePoleFilter(type) {
  if (!(this instanceof OnePoleFilter)) return new OnePoleFilter(type);
  this.type = type || 'lpf';
  this.out = {
    type: this.type,
    valueOf: function valueOf() {
      return this[this.type];
    }
  };
  this.fc = 200;
  this.a = 1;
  this.b = 1;
  this.reset();
  this.update();
}

OnePoleFilter.prototype.reset = function () {
  this.z1 = 0;
};

OnePoleFilter.prototype.getFeedbackOutput = function () {
  return this.z1 * this.b;
};

OnePoleFilter.prototype.update = function () {
  var wa = (0, _prewarp2.default)(this.fc);
  this.a = wa / (1.0 + wa);
};

OnePoleFilter.prototype.cut = function (fc) {
  this.fc = fc;
  this.update();
  return this;
};

OnePoleFilter.prototype.run = function (xn) {
  var out = this.out;
  var vn = (xn - this.z1) * this.a;
  out.lpf = vn + this.z1;
  this.z1 = vn + out.lpf;
  out.hpf = xn - out.lpf;
  out.apf = out.lpf - out.hpf;
  return out;
};

},{"prewarp":25}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _combfilter = require('combfilter');

var _combfilter2 = _interopRequireDefault(_combfilter);

var _allpass = require('allpass');

var _allpass2 = _interopRequireDefault(_allpass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module freeverb
 * @author stagas
 * @org opendsp
 * @desc freeverb reverb effect
 * @license mit
 */

exports.default = Reverb;


var combs_a = [1116, 1188, 1277, 1356].map(stretch);
var combs_b = [1422, 1491, 1557, 1617].map(stretch);
var aps = [225, 556, 441, 341].map(stretch);

function Reverb() {
  if (!(this instanceof Reverb)) return new Reverb();
  this.combs_a = combs_a.map(_combfilter2.default);
  this.combs_b = combs_b.map(_combfilter2.default);
  this.aps = aps.map(_allpass2.default);
  this.room(0.5);
  this.damp(0.5);
}

Reverb.prototype.room = function (n) {
  n = n * 0.28 + 0.7;
  this.combs_a.forEach(setProperty('feedback', n));
  this.combs_b.forEach(setProperty('feedback', n));
  return this;
};

Reverb.prototype.damp = function (n) {
  n *= 0.4;
  this.combs_a.forEach(setProperty('damp', n));
  this.combs_b.forEach(setProperty('damp', n));
  return this;
};

Reverb.prototype.run = function (input) {
  var output = this.combs_a.map(run).reduce(sum) + this.combs_b.map(run).reduce(sum);
  output = this.aps.reduce(waterfall, output);
  return output;
  function run(el) {
    return el.run(input);
  }
};

function sum(p, n) {
  return p + n;
}

function waterfall(p, n) {
  return p + n.run(p);
}

function stretch(n) {
  return n * (sampleRate / 44100) | 0;
}

function setProperty(key, value) {
  return function (obj) {
    obj[key] = value;
  };
}

},{"allpass":16,"combfilter":17}],16:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],17:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _filter = require('filter');

var _filter2 = _interopRequireDefault(_filter);

var _prewarp = require('prewarp');

var _prewarp2 = _interopRequireDefault(_prewarp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module korg35lpf
 * @author stagas
 * @desc korg35 lowpass filter
 * @org opendsp
 * @credits Will Pirkle
 * @see http://www.willpirkle.com/project-gallery/app-notes/
 * @license mit
 */

exports.default = Korg35LPF;


function Korg35LPF() {
  if (!(this instanceof Korg35LPF)) return new Korg35LPF();
  this.lpf1 = (0, _filter2.default)('lpf');
  this.lpf2 = (0, _filter2.default)('lpf');
  this.hpf1 = (0, _filter2.default)('hpf');
  this.fc = 200;
  this.a = 0;
  this.k = 0.01;
  this._sat = 1.0;
  this.nlp = true;
}

Korg35LPF.prototype.reset = function () {
  this.lpf1.reset();
  this.lpf2.reset();
  this.hpf1.reset();
};

Korg35LPF.prototype.update = function () {
  var g = (0, _prewarp2.default)(this.fc);
  var G = g / (1 + g);
  var k = this.k;

  this.lpf1.a = G;
  this.lpf2.a = G;
  this.hpf1.a = G;

  this.lpf2.b = (k - k * G) / (1 + g);
  this.hpf1.b = -1 / (1 + g);

  this.a = 1 / (1 - k * G + k * G * G);
};

Korg35LPF.prototype.cut = function (fc) {
  this.fc = fc;
  this.update();
  return this;
};

Korg35LPF.prototype.res = function (k) {
  this.k = k;
  return this;
};

Korg35LPF.prototype.sat = function (n) {
  this._sat = n;
  return this;
};

Korg35LPF.prototype.run = function (xn) {
  var y1 = this.lpf1.run(xn);
  var S35 = this.hpf1.getFeedbackOutput() + this.lpf2.getFeedbackOutput();

  var u = this.a * (y1 + S35);

  if (this.nlp) {
    u = tanh(this._sat * u);
  }

  var y = this.k * this.lpf2.run(u);

  this.hpf1.run(y);

  if (this.k > 0) y *= 1 / this.k;

  return y;
};

function tanh(x) {
  x = Math.exp(2 * x);
  return (x - 1) / (x + 1);
}

},{"filter":19,"prewarp":25}],19:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"dup":14,"prewarp":25}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _filter = require('filter');

var _filter2 = _interopRequireDefault(_filter);

var _prewarp = require('prewarp');

var _prewarp2 = _interopRequireDefault(_prewarp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module moogladder
 * @author stagas
 * @desc moog ladder filter
 * @org opendsp
 * @credits Will Pirkle
 * @see http://www.willpirkle.com/project-gallery/app-notes/
 * @license mit
 */

exports.default = MoogLadder;


function MoogLadder(model) {
  if (!(this instanceof MoogLadder)) return new MoogLadder(model);
  this.lpf1 = (0, _filter2.default)('lpf');
  this.lpf2 = (0, _filter2.default)('lpf');
  this.lpf3 = (0, _filter2.default)('lpf');
  this.lpf4 = (0, _filter2.default)('lpf');
  this.apf1 = (0, _filter2.default)('apf');
  this.model = model || 'half';

  this.fc = 200;
  this.a = 0;
  this.k = 0.01;
  this.s = 1.0;
  this.nlp = true;
}

MoogLadder.prototype.reset = function () {
  this.lpf1.reset();
  this.lpf2.reset();
  this.lpf3.reset();
  this.lpf4.reset();
  this.apf1.reset();
};

MoogLadder.prototype.update = function () {
  var g = (0, _prewarp2.default)(this.fc);
  var G = g / (1 + g);

  if ('half' === this.model) {
    // the allpass G value
    var GA = 2.0 * G - 1;

    // set alphas
    this.lpf1.a = G;
    this.lpf2.a = G;
    this.apf1.a = G;

    // set beta feedback values
    this.lpf1.b = GA * G / (1.0 + g);
    this.lpf2.b = GA / (1.0 + g);
    this.apf1.b = 2.0 / (1.0 + g);

    // calculate alpha0
    // for 2nd order, K = 2 is max so limit it there
    var K = this.k;
    if (K > 2) K = 2;

    this.a = 1.0 / (1.0 + K * GA * G * G);
  } else {
    // set alphas
    this.lpf1.a = G;
    this.lpf2.a = G;
    this.lpf3.a = G;
    this.lpf4.a = G;

    // set beta feedback values
    this.lpf1.b = G * G * G / (1.0 + g);
    this.lpf2.b = G * G / (1.0 + g);
    this.lpf3.b = G / (1.0 + g);
    this.lpf4.b = 1.0 / (1.0 + g);

    // calculate alpha0
    // Gm = G^4
    this.a = 1.0 / (1.0 + this.k * G * G * G * G);
  }

  return this;
};

MoogLadder.prototype.cut = function (fc) {
  this.fc = fc;
  return this;
};

MoogLadder.prototype.res = function (k) {
  this.k = k;
  return this;
};

MoogLadder.prototype.sat = function (s) {
  this.s = s;
  return this;
};

MoogLadder.prototype.run = function (xn) {
  var SM = 0;
  var y = 0;

  if ('half' === this.model) {
    SM = this.lpf1.getFeedbackOutput() + this.lpf2.getFeedbackOutput() + this.apf1.getFeedbackOutput();
  } else {
    SM = this.lpf1.getFeedbackOutput() + this.lpf2.getFeedbackOutput() + this.lpf3.getFeedbackOutput() + this.lpf4.getFeedbackOutput();
  }

  var K = this.k;
  if ('half' === this.model && K > 2) K = 2;

  var u = this.a * (xn - K * SM);

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

function tanh(x) {
  x = Math.exp(2 * x);
  return (x - 1) / (x + 1);
}

},{"filter":21,"prewarp":25}],21:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"dup":14,"prewarp":25}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = nopop;

/**
 * @module nopop
 * @author stagas
 * @license mit
 */

function nopop(threshold, amount) {
  var prev = 0,
      diff = 0;
  threshold = threshold || 0.05;
  amount = amount || 0.12;
  return function (next) {
    diff = next - prev;
    if (Math.abs(diff) > threshold) {
      prev += diff * amount;
    } else {
      prev = next;
    }
    return prev;
  };
}

},{}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = note;
exports.stringToNote = stringToNote;

/**
 * @module note
 * @author stagas
 * @org opendsp
 * @desc get note by number or string
 * @see https://en.wikipedia.org/wiki/Piano_key_frequencies
 */

function note(n) {
  if ('string' === typeof n) n = stringToNote(n);
  return Math.pow(2, (n - 57) / 12) * 440;
}

function stringToNote(s) {
  s = s.split('');
  var octave = parseInt(s[s.length - 1], 10);
  if (isNaN(octave)) octave = 4;
  var note = s[0].toLowerCase();
  var flat = s[1] === 'b';
  var sharp = s[1] === '#';
  var notes = 'ccddeffggaab';
  return notes.indexOf(note) + octave * 12 + sharp - flat;
}

},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sin = sin;
exports.saw = saw;
exports.ramp = ramp;
exports.tri = tri;
exports.sqr = sqr;
exports.pulse = pulse;
exports.noise = noise;

/**
 * @module osc
 * @author stagas
 * @org opendsp
 * @version 1.1.0
 * @desc oscillators
 * @license mit
 */

var tau = 2 * Math.PI;

function sin(t, f) {
  return Math.sin(f * t * tau);
}

function saw(t, f) {
  return 1 - 2 * (t % (1 / f)) * f;
}

function ramp(t, f) {
  return 2 * (t % (1 / f)) * f - 1;
}

function tri(t, f) {
  return Math.abs(1 - 2 * t * f % 2) * 2 - 1;
}

function sqr(t, f) {
  return (t * f % 1 / f < 1 / f / 2) * 2 - 1;
}

function pulse(t, f, w) {
  return (t * f % 1 / f < 1 / f / 2 * w) * 2 - 1;
}

function noise() {
  return Math.random() * 2 - 1;
}

},{}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = prewarp;

/**
 * @module prewarp
 * @author stagas
 * @org opendsp
 * @license mit
 */

function prewarp(f) {
  return Math.tan(Math.PI * f / sampleRate);
}

},{}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sampler = Sampler;
exports.Sample = Sample;
exports.wavToFloat32Array = wavToFloat32Array;

/**
 * @module sampler
 * @author stagas
 * @desc sampler
 * @license mit
 */

exports.default = Sampler;
function Sampler(n) {
  if (!(this instanceof Sampler)) return new Sampler(n);
  this.voices = Array(n || 4);
  this.voice = 0;
  this.coeff = 0;
  this.bank = {};
}

Sampler.prototype.add = function (key, sample) {
  this.bank[key] = Sample(sample);
  return this;
};

Sampler.prototype.tune = function (n) {
  this.coeff = n;
  return this;
};

Sampler.prototype.play = function (key, vol, speed) {
  this.voices[this.voice++] = {
    sample: Sample(this.bank[key]),
    vol: vol || 1,
    speed: (speed || 1) * this.coeff
  };
  if (this.voice === this.voices.length) this.voice = 0;
  return this;
};

Sampler.prototype.mix = function () {
  return this.voices.reduce(sum, 0);
};

function Sample(buffer) {
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

  function play(speed) {
    if (i > len) return 0;
    s = floats[i | 0];
    i += (speed || 1) * coeff;
    return isNaN(s) ? 0 : s;
  }
}

function wavToFloat32Array(buffer) {
  var view = new DataView(buffer, 44);
  var len = view.byteLength / 2;
  var floats = new Float32Array(len);
  for (var i = 0; i < view.byteLength; i += 2) {
    var s = view.getUint16(i, true);
    if (s > 32767) {
      s -= 65536;
    }
    s /= 32768;
    floats[i / 2] = s;
  }
  return floats;
}

function sum(p, n) {
  return p + n.sample(n.speed) * n.vol;
}

},{}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

/**
 * @module scales
 * @author stagas
 * @version 1.0.0
 * @desc musical scales
 * @license mit
 * 
 * adapted from https://github.com/hdavid/Launchpad95
 */

var scales = exports.scales = {
	'major': [0, 2, 4, 5, 7, 9, 11],
	'minor': [0, 2, 3, 5, 7, 8, 10],
	'ionian': [0, 2, 4, 5, 7, 9, 11],
	'aeolian': [0, 2, 3, 5, 7, 8, 10],
	'dorian': [0, 2, 3, 5, 7, 9, 10],
	'mixolydian': [0, 2, 4, 5, 7, 9, 10],
	'lydian': [0, 2, 4, 6, 7, 9, 11],
	'phrygian': [0, 1, 3, 5, 7, 8, 10],
	'locrian': [0, 1, 3, 5, 6, 8, 10],
	'diminished': [0, 1, 3, 4, 6, 7, 9, 10],
	'whole half': [0, 2, 3, 5, 6, 8, 9, 11],
	'whole tone': [0, 2, 4, 6, 8, 10],
	'minor blues': [0, 3, 5, 6, 7, 10],
	'minor pentatonic': [0, 3, 5, 7, 10],
	'major pentatonic': [0, 2, 4, 7, 9],
	'harmonic minor': [0, 2, 3, 5, 7, 8, 11],
	'melodic minor': [0, 2, 3, 5, 7, 9, 11],
	'super locrian': [0, 1, 3, 4, 6, 8, 10],
	'bhairav': [0, 1, 4, 5, 7, 8, 11],
	'hungarian minor': [0, 2, 3, 6, 7, 8, 11],
	'minor gypsy': [0, 1, 4, 5, 7, 8, 10],
	'hirojoshi': [0, 2, 3, 7, 8],
	'in sen': [0, 1, 5, 7, 10],
	'iwato': [0, 1, 5, 6, 10],
	'kumoi': [0, 2, 3, 7, 9],
	'pelog': [0, 1, 3, 4, 7, 8],
	'spanish': [0, 1, 3, 4, 5, 6, 8, 10],
	'ion aeol': [0, 2, 3, 4, 5, 7, 8, 9, 10, 11]
};

},{}],28:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = step;
function step(bpm) {
  return function (sig, offset) {
    offset = offset ? Math.round(60 / bpm * 4 * sampleRate * offset) : 0;
    var max = Math.round(60 / bpm * 4 * sampleRate * sig);
    var acc = 0;
    var prev = 0;
    return function (frame) {
      frame += offset;
      acc = frame - prev;
      if (acc === 0 || acc === max) {
        prev = frame;
        acc = 0;
        return true;
      } else {
        return false;
      }
    };
  };
}

},{}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * @module wavetable-osc
 * @author stagas
 * @org opendsp
 * @license mit
 */

exports.default = Oscillator;

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

function Oscillator(type, size, alias) {
  if (!(this instanceof Oscillator)) return new Oscillator(type, size, alias);
  this.pos = 0;
  this.size = size || sampleRate;
  this.coeff = this.size / sampleRate;
  this.table = new Float32Array(this.size);
  this.alias = alias === false ? false : true;
  this.build(type);
}

/**
 * Builds wavetable of wave `type`.
 *
 * @param {String} type
 * @private
 */

Oscillator.prototype.build = function (type) {
  switch (type) {
    case 'sin':
      var scale = 2 * Math.PI / this.size;
      for (var i = 0; i < this.size; i++) {
        this.table[i] = Math.sin(i * scale);
      }
      break;

    case 'saw':
      for (var i = 0; i < this.size; i++) {
        var x = i / this.size;
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
        var x = i / this.size - 0.25;
        this.table[i] = 1.0 - 4.0 * Math.abs(Math.round(x) - x);
      }
      break;

    case 'ramp':
      for (var i = 0; i < this.size; i++) {
        var x = i / this.size;
        this.table[i] = -2.0 * (x - Math.round(x));
      }
      break;

    case 'noise':
      for (var i = 0; i < this.size; i++) {
        var x = i / this.size;
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

Oscillator.prototype.play = function (freq) {
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

var Sin = exports.Sin = factory('sin');
var Saw = exports.Saw = factory('saw');
var Sqr = exports.Sqr = factory('sqr');
var Tri = exports.Tri = factory('tri');
var Ramp = exports.Ramp = factory('ramp');
var Noise = exports.Noise = factory('noise');

/**
 * Creates an Oscillator factory currying `type`.
 *
 * @param {String} type
 * @return {Function}
 * @private
 */

function factory(type) {
  return function (size, alias) {
    var osc = Oscillator(type, size, alias);
    return osc.play.bind(osc);
  };
}

},{}]},{},[1])(1)
});