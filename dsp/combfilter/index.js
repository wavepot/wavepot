
/**
 * @module combfilter
 * @author stagas
 * @org opendsp
 * @desc comb filter
 * @license mit
 */

export default CombFilter;

function CombFilter(size){
  if (!(this instanceof CombFilter)) return new CombFilter(size);
  this.size = size;
  this.index = 0;
  this.buffer = new Float32Array(size);
  this.feedback = 0;
  this.filter = 0;
  this.damp = 0;
}

CombFilter.prototype.run = function(input){
  var output = this.buffer[this.index];
  this.filter = output * (1 - this.damp) + this.filter * this.damp;
  this.buffer[this.index] = input * 0.015 + this.filter * this.feedback;
  if (++this.index === this.size) this.index = 0;
  return output;
};
