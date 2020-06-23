
/**
 * @module nopop
 * @author stagas
 * @license mit
 */

export default function nopop(threshold, amount) {
  var prev = 0, diff = 0;
  threshold = threshold || 0.05;
  amount = amount || 0.12;
  return function(next) {
    diff = next - prev;
    if (Math.abs(diff) > threshold) {
      prev += diff * amount;
    } else {
      prev = next;
    }
    return prev;
  };
}
