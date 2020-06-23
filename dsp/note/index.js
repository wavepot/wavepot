
/**
 * @module note
 * @author stagas
 * @org opendsp
 * @desc get note by number or string
 * @see https://en.wikipedia.org/wiki/Piano_key_frequencies
 */

export default function note(n){
  if ('string' === typeof n) n = stringToNote(n);
  return Math.pow(2, (n - 57)/12) * 440;
}

export function stringToNote(s){
  s = s.split('');
  var octave = parseInt(s[s.length - 1], 10);
  if (isNaN(octave)) octave = 4;
  var note = s[0].toLowerCase();
  var flat = s[1] === 'b';
  var sharp = s[1] === '#';
  var notes = 'ccddeffggaab';
  return notes.indexOf(note) + (octave * 12) + sharp - flat;
}
