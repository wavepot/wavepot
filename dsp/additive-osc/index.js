
/**
 * @module additive-osc
 * @org opendsp
 * @author potasmic
 * @version 0.1.1
 * @desc additive oscillators
 * @license mit
 */

export default Osc;

function Osc(type, cyc) {
  if (!(this instanceof Osc)) return new Osc(type, cyc);
  this.iter = cyc || 16;
  this.type = type;
  this.config(type);
}

Osc.prototype.config = function(type) {
  switch(type) {
    case 'sqr': 
      this.a = 4 / Math.PI;
      this.s = 1;
      
      this.l = function(k,freq,t) {
        return Math.sin(2*Math.PI*(2*k-1)*freq*t)/(2*k-1);
      }
    break;
    case 'tri':
      this.a = 8 / Math.pow(Math.PI,2);
      this.s = 0;
      
      this.l = function(k,freq,t) {
        return Math.pow(-1,k)*Math.sin(2*Math.PI*(2*k+1)*freq*t)/Math.pow(2*k+1,2);
      }
    break;
    case 'saw':
      this.a = 2 / Math.PI;
      this.s = 1;
      
      this.l = function(k,freq,t) {
        return Math.pow(-1,k)*Math.sin(2*Math.PI*k*freq*t)/k;
      }
    break;
    case 'ramp':
      this.a = -2 / Math.PI ;
      this.s = 1;
      
      this.l = function(k,freq,t) {
        return Math.sin(2*Math.PI*k*freq*t)/k;
      }
    break;
  }
}

function cycle(k, f, t, a, num, denom) {
  return a(k)*num(k,f,t)/denom(k);
}

Osc.prototype.play = function(t,freq) {
  var sum = 0;
  
  for(var k = this.s; k <= this.iter; k++) 
    {
      sum += this.l(k, freq, t);
    }
  return this.a * sum;
}

Osc.prototype.setCycle = function(cyc) {
  this.iter = cyc;
  return this;
}

Osc.prototype.setType = function(type) {
  this.type = type;
  this.config(type);
  return this;
}

export var Sqr = Osc('sqr');
export var Tri = Osc('tri');
export var Saw = Osc('saw');