import '../../setup.js'
import * as dsp from '../../fixtures/dsp.js'
import Context from '../../../js/dsp/context.js'
import render from '../../../js/dsp/render.js'

const factory = (channels = 1, length = 44100) => {
  const output = Array(channels).fill().map(() => new Float32Array(length))

  const context = new Context({
    output,
    length,
    lengths: {
      bar: length,
      beat: length
    }
  })

  return context
}

const dspRender = (fn, channels, length, start = 0) => {
  const output = Array(channels).fill().map(() => new Float32Array(length))
  for (let n = 0; n < length; n++) {
    let sample = fn({ valueOf: () => (1 + start + n) / length, n })
    for (let channel = 0; channel < output.length; channel++) {
      output[channel][n] = Array.isArray(sample) ? sample[channel] : sample
    }
  }
  return output
}

const testDspFixture = (context, fixture, start = 0) => {
  const expected = dspRender(fixture.fn, fixture.channels, fixture.length, start)
  render(fixture.fn, context)
  for (let i = 0; i < context.output.length; i++) {
    expect(context.output[i]).to.be.buffer(expected[i])
  }
  expect(context.n).to.equal(context.length + start)
  expect(context.meta.renderDuration).to.be.a('number')
}

describe("await render(fn, context)", () => {
  it("should render a mono fn", () => {
    const fixture = {
      channels: 1,
      length: 10,
      fn: dsp.sine
    }
    const context = factory(fixture.channels, fixture.length)
    testDspFixture(context, fixture)
  })

  it("should render a mono fn two bars", () => {
    const fixture = {
      channels: 1,
      length: 10,
      fn: dsp.sine
    }
    const context = factory(fixture.channels, fixture.length)
    testDspFixture(context, fixture)
    testDspFixture(context, fixture, fixture.length)
  })

  it("should render a stereo fn", () => {
    const fixture = {
      channels: 2,
      length: 10,
      fn: dsp.stereoSine
    }
    const context = factory(fixture.channels, fixture.length)
    testDspFixture(context, fixture)
  })

  it("should zero out NaN, Infinity, -Infinity", () => {
    const fixture = {
      channels: 1,
      length: 4,
      fn: dsp.broken
    }
    const context = factory(fixture.channels, fixture.length)
    const expected = dspRender(fixture.fn, fixture.channels, fixture.length, 0)
    render(fixture.fn, context)
    expect(expected[0]).to.be.buffer([NaN,Infinity,-Infinity,NaN])
    expect(context.output[0]).to.be.buffer([0,0,0,0])
  })
})
