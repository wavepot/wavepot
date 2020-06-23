
/**
 * @module delay
 * @author stagas
 * @org opendsp
 * @desc delay
 * @see http://www.musicdsp.org/showone.php?id=98
 * @license mit
 */

export default Delay;

function Delay(size){
  if (!(this instanceof Delay)) return new Delay(size);
  size = size || 512;
  this.buffer = new Float32Array(size);
  this.size = size;
  this.counter = 0;
  this._feedback = 0.5;
  this._delay = 100;
}

Delay.prototype.feedback = function(n){
  this._feedback = n;
  return this;
};

Delay.prototype.delay = function(n){
  this._delay = n;
  return this;
};

Delay.prototype.run = function(inp, mix = .5) {
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

  var out = ((c3*x+c2)*x+c1)*x+c0;

  this.buffer[this.counter] = inp + out*this._feedback;

  this.counter++;

  if (this.counter >= this.size) this.counter = 0;

  return out * mix + inp * (1-mix);
};
