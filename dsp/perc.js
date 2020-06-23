export default function perc(o, decay, wave){
  var env = Math.max(0, 0.889 - (o * decay) / ((o * decay) + 1));
  return wave * env;
}
