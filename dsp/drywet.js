export default (amount, output, dry, wet) => {
  const dryAmount = 1 - amount
  const wetAmount = amount
  for (let i = 0; i < output.length; i++) {
    output[i] = dry[i] * dryAmount + wet[i] * wetAmount
  }
}
