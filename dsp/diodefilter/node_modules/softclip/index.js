
/**
 * @module softclip
 * @author stagas
 * @org opendsp
 * @desc soft clip
 * @license mit
 */

export default function clip(x, amt){
  return x / ((amt || 1) + Math.abs(x));
}
