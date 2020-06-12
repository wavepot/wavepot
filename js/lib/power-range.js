export default ([begin, end], size) => {
  if (begin - end === 0) return [begin, end]

  let diff

  if (end < begin) {
    diff = end + size - begin + 1
  } else {
    diff = end - begin + 1
  }

  const nearest = 2 ** Math.floor(Math.log(diff) / Math.LN2)

  // if (nearest > 1) {
    begin = (end - nearest + 1) % size

    if (begin < 0) begin += size
  // }

  return [begin, end]
}
