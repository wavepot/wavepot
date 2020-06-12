export default sample =>
  Array.isArray(sample)
  && sample.length === 2
  && typeof sample[0] === 'number'
  && typeof sample[1] === 'number'
