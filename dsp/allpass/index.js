
/**
 * @module allpass
 * @author stagas
 * @org opendsp
 * @desc allpass filter
 * @license mit
 */

export default Allpass;

function Allpass(size){
  if (!(this instanceof Allpass)) return new Allpass(size);
  this.size = size;
  this.index = 0;
  this.buffer = new Float32Array(size);
}

Allpass.prototype.run = function(input){
  var sample = this.buffer[this.index];
  var output = -input + sample;
  this.buffer[this.index] = input + (sample * 0.5);
  if (++this.index === this.size) this.index = 0;
  return output;
};
