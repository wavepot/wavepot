import note from '../note/index.js'
import MIDI from './index.js'

async function dsp () {
  const cc = await MIDI();
  return t => {
    return Math.sin(note(cc(37)) * t * 2)
  }
}

const test = () => setInterval(() => {
  dsp().then(fn => console.log(fn(1)))
}, 1000)

console.log(`clearInterval(${test()}) to stop listening`)
