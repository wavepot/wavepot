
/**
 * @module osc
 * @author stagas
 * @org opendsp
 * @version 1.1.0
 * @desc oscillators
 * @license mit
 */

var tau = 2 * Math.PI;

export function sin(t, f){
  return Math.sin(f * t * tau);
}

export function saw(t, f){
  return 1 - 2 * (t % (1 / f)) * f;
}

export function ramp(t, f){
  return 2 * (t % (1 / f)) * f - 1;
}

export function tri(t, f){
  return Math.abs(1 - (2 * t * f) % 2) * 2 - 1;
}

export function sqr(t, f){
  return (t*f % 1/f < 1/f/2) * 2 - 1;
}

export function pulse(t, f, w){
  return (t*f % 1/f < 1/f/2*w) * 2 - 1;
}

export function noise(){
  return Math.random() * 2 - 1;
}
