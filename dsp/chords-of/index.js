
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

export default function(scale, voices){
  var chords = {};
  var s = scale.concat(scale.map(oct(1))).concat(scale.map(oct(2)));
  voices = voices || 3;
  
  for (var n in roman) {
    n = +n;
    var c = 
    chords[roman[n]] = 
    chords[roman[n].toUpperCase()] = [];
    for (var i = n; i < n + voices * 2; i += 2) {
      c.push(s[i-1]);
    }
  }

  return chords;
}

function oct(x){
  return function(y){
    return y + (x * 12);
  };
}
