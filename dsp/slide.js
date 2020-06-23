export default function slide(t, measure, speed, seq){
  var pos = (t / measure / 2) % seq.length;
  var now = pos | 0;
  var next = now + 1;
  var alpha = pos - now;
  if (next == seq.length) next = 1;
  return seq[now] + ((seq[next] - seq[now]) * Math.pow(alpha, speed));
}
