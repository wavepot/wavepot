
/**
 * @module chords
 * @author stagas
 * @desc chord generator
 * @version 1.0.1
 * @license mit
 */

export default Chords;

var notes = 'ccddeffggaab';

function Chords(s){
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
  'maj7': [0, 4, 7, 11], 'min7' : [0, 3, 7, 10], '7': [0, 4, 7, 10],
  'maj9': [0, 4, 7, 11, 14], '9': [0, 4, 7, 10, 14], 'min9': [0, 3, 7, 10, 14],
  'maj11': [0, 4, 7, 11, 14, 17], '11': [0, 4, 7, 10, 14, 17], 'min11': [0, 3, 7, 10, 14, 17],
  'maj13': [0, 4, 7, 11, 14, 17, 21], '13': [0, 4, 7, 10, 14, 17, 21], 'min13': [0, 3, 7, 10, 14, 17, 21]
};

function transpose(x){
  return function(y){
    return x + y;
  };
}
