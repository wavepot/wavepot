
/**
 * @module chord
 * @author stagas
 * @desc chord player
 * @version 1.1.0
 * @license mit
 */

export default function Chord(Osc, a, b, c, d, e){
  var voices = '1234567'.split('').map(function(){
    return Osc(a,b,c,d,e);
  });
  var play = Play(voices);
  return function(notes, vel){
    return notes.map(play(vel)).reduce(sum);
  };
}

function Play(voices){
  return function(vel){
    vel = vel || 0.1;
    return function(f, i){
      return voices[i](f) * (1 - i * vel);
    };
  };
}

function sum(p, n){
  return (p + n) / 2;
}
