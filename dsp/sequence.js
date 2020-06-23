
export default function sequence(t, measure, seq){
  return seq[(t / measure / 4 | 0) % seq.length];
}
