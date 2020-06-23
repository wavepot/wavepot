
/**
 * @module step
 * @author stagas
 * @license
 */

import { sampleRate } from '../../settings.js'

export default function step(bpm) {
  return function(sig, offset) {
    offset = offset ? Math.round((60 / bpm * 4) * sampleRate * offset) : 0;
    var max = Math.round((60 / bpm * 4) * sampleRate * sig);
    var acc = 0;
    var prev = 0;
    return function(frame) {
      frame += offset;
      acc = frame - prev;
      if (acc === 0 || acc === max) {
        prev = frame;
        acc = 0;
        return true;
      } else {
        return false;
      }
    };
  };
}
