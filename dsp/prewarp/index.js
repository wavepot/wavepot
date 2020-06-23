
/**
 * @module prewarp
 * @author stagas
 * @org opendsp
 * @license mit
 */
import { sampleRate } from '../../settings.js'

export default function prewarp(f){
  return Math.tan(Math.PI * f / sampleRate);
}
