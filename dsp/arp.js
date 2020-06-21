
export default function arp(t, measure, x, y, z) {
  var ts = t / 4 % measure
  return Math.sin(x * (Math.exp(-ts * y))) * Math.exp(-ts * z)
}
