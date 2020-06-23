import arp from './arp.js'
import clip from './softclip/index.js'
import Delay from './delay/index.js'
import { beatFrames, blockFrames } from '../settings.js'

export var dsp = async () => {
  var delay = new Delay(blockFrames)
  delay.feedback(.98).delay(beatFrames/5000)
  return t => {
    var kick = arp(t, 1/4, 40.40, 99, 44.44)
    kick = delay.run(kick, .5) * .5
    kick = clip(kick, .3)
    return kick
  }
}
