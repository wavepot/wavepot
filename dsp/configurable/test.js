
var assert = require('assert');
var cfg = require('./index');

var obj = cfg({ foo: 'bar' }, {
  one: 0,
  two: 'two',
  three: 'three'
});

obj
  .one(1)
  .two('2')
  ;

assert('bar' === obj.foo);
assert(1 === obj._one);
assert('2' === obj._two);
assert('three' === obj._three);

//

var obj = cfg({
  one: 0,
  two: 'two',
  three: 'three'
});

obj
  .one(1)
  .two('2')
  ;

assert(1 === obj._one);
assert('2' === obj._two);
assert('three' === obj._three);

// bench

console.time('sets');

for (var i = 50000; i--; ) {
  for (var x = 10; x--; ) {
    obj
      .one(i + x)
      .two(Math.random())
      .three('whatever');
  }
}

console.timeEnd('sets');
