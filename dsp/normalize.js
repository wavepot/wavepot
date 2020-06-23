export default function normalize (number) {
  return number === Infinity || number === -Infinity || isNaN(number) ? 0 : number
}
