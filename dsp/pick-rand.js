import rand from './seedable-random.js'

export default function pickRand (array) {
  return array[rand() * array.length | 0]
}
