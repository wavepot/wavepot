import envelope from './envelope/index.js'
import arp from './arp.js'
import clip from './softclip/index.js'

export default t => {
  var kick =
    + (arp(t, 1/4, 50.94, 60, 40)
    + arp(t, 1/4, 32.9, 60, 30))
    * envelope(t, 1/4, 48, 52, 1)
  kick = clip(kick, .33)
  return kick
}