
/**
 * @module envelope
 * @author stagas
 * @org opendsp
 * @desc envelope
 * @license mit
 */

export default function envelope(t, measure, decay, release){
  var ts = t / 4 % measure;
  return Math.exp(-ts * decay * Math.exp(ts * release));
}
