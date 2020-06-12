import powerRange from '../../js/lib/power-range.js'

const isPowerOfTwo = n => n > 0 && !(n & (n - 1))

const isPowerOfTwoRange = ([begin, end], size) => {
  if (begin === end) return isPowerOfTwo(begin)

  let diff

  if (end < begin) {
    diff = end + size - begin + 1
  } else {
    diff = end - begin + 1
  }

  return isPowerOfTwo(diff)
}

describe("power of two range", () => {
  it("should get highest nearest power of two range within a wrapping range", () => {
    // 4
    expect(powerRange([0,0], 4)).to.deep.equal([0,0])
    expect(powerRange([0,1], 4)).to.deep.equal([0,1])
    expect(powerRange([0,2], 4)).to.deep.equal([1,2])
    expect(powerRange([0,3], 4)).to.deep.equal([0,3])

    expect(powerRange([1,1], 4)).to.deep.equal([1,1])
    expect(powerRange([1,2], 4)).to.deep.equal([1,2])
    expect(powerRange([1,3], 4)).to.deep.equal([2,3])
    expect(powerRange([1,0], 4)).to.deep.equal([1,0])

    expect(powerRange([2,2], 4)).to.deep.equal([2,2])
    expect(powerRange([2,3], 4)).to.deep.equal([2,3])
    expect(powerRange([2,0], 4)).to.deep.equal([3,0])
    expect(powerRange([2,1], 4)).to.deep.equal([2,1])

    expect(powerRange([3,3], 4)).to.deep.equal([3,3])
    expect(powerRange([3,0], 4)).to.deep.equal([3,0])
    expect(powerRange([3,1], 4)).to.deep.equal([0,1])
    expect(powerRange([3,2], 4)).to.deep.equal([3,2])

    // 8
    expect(powerRange([0,0], 8)).to.deep.equal([0,0])
    expect(powerRange([0,1], 8)).to.deep.equal([0,1])
    expect(powerRange([0,2], 8)).to.deep.equal([1,2])
    expect(powerRange([0,3], 8)).to.deep.equal([0,3])
    expect(powerRange([0,4], 8)).to.deep.equal([1,4])
    expect(powerRange([0,5], 8)).to.deep.equal([2,5])
    expect(powerRange([0,6], 8)).to.deep.equal([3,6])
    expect(powerRange([0,7], 8)).to.deep.equal([0,7])

    expect(powerRange([1,1], 8)).to.deep.equal([1,1])
    expect(powerRange([1,2], 8)).to.deep.equal([1,2])
    expect(powerRange([1,3], 8)).to.deep.equal([2,3])
    expect(powerRange([1,4], 8)).to.deep.equal([1,4])
    expect(powerRange([1,5], 8)).to.deep.equal([2,5])
    expect(powerRange([1,6], 8)).to.deep.equal([3,6])
    expect(powerRange([1,7], 8)).to.deep.equal([4,7])
    expect(powerRange([1,0], 8)).to.deep.equal([1,0])

    expect(powerRange([2,2], 8)).to.deep.equal([2,2])
    expect(powerRange([2,3], 8)).to.deep.equal([2,3])
    expect(powerRange([2,4], 8)).to.deep.equal([3,4])
    expect(powerRange([2,5], 8)).to.deep.equal([2,5])
    expect(powerRange([2,6], 8)).to.deep.equal([3,6])
    expect(powerRange([2,7], 8)).to.deep.equal([4,7])
    expect(powerRange([2,0], 8)).to.deep.equal([5,0])
    expect(powerRange([2,1], 8)).to.deep.equal([2,1])

    expect(powerRange([3,3], 8)).to.deep.equal([3,3])
    expect(powerRange([3,4], 8)).to.deep.equal([3,4])
    expect(powerRange([3,5], 8)).to.deep.equal([4,5])
    expect(powerRange([3,6], 8)).to.deep.equal([3,6])
    expect(powerRange([3,7], 8)).to.deep.equal([4,7])
    expect(powerRange([3,0], 8)).to.deep.equal([5,0])
    expect(powerRange([3,1], 8)).to.deep.equal([6,1])
    expect(powerRange([3,2], 8)).to.deep.equal([3,2])

    for (let i = 1, size = 1; size <= 128; size = 2 ** i++) {
      for (let begin = 0; begin < size; begin++) {
        for (let end = begin; end < begin + size; end++) {
          const range = powerRange([begin, end % size], size)
          expect(isPowerOfTwoRange(range, size) || range[0] === range[1]).to.equal(true)
        }
      }
    }
  })
})
