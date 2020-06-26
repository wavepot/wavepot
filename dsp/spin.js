import Wavetable from './wavetable-osc/index.js'

export default (context, speed, phase) => {
  const spin = Wavetable(context, 'sin', null, null, phase)
  let i = 0
  context.handle = true
  return ({ n, input, output }) => {
    if (n === 0) spin.reset()
    for (i = 0; i < context.length; i++) {
      output[0][i] = input[0][Math.floor((n + i) * (spin(speed)/2+1)) % context.length]
    }
  }
}
