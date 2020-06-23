
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
  

export default Bitter;

function Bitter(dep) {
   if(!(this instanceof Bitter)) return new Bitter(dep);
    this.depth    = (dep > 0)? parseInt(dep) : 8;
    this.preGain  = 1;
    this.postGain = 1;
    return this;
}

Bitter.prototype.run = function(input) {
  return this.postGain * (Math.round( this.preGain * input * this.depth ) / this.depth);
};

Bitter.prototype.setDepth = function(n) {
  this.depth = parseInt(Math.abs(n));
  return this;
};

Bitter.prototype.setPreGain = function(k) {
  this.preGain = k;
  return this;
};

Bitter.prototype.setPostGain = function(k) {
  this.postGain = k;
  return this;
}