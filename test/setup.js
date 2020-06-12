// compare two buffers, fails on first difference with: [index, value]
chai.use(function (_, utils) {
  chai.Assertion.addMethod('buffer', function (expected) {
    const result = utils.flag(this, 'object')
    new chai.Assertion(result.length).to.equal(expected.length)
    for (let i = 0; i < result.length; i++) {
      new chai.Assertion([i, result[i]]).to.deep.equal([i, expected[i]], ['\n\nact:\t', result, '\n\nexp:\t', expected, '\n\n'])
    }
  })
})
