import randomId from './random-id.js'

export default (name = randomId(), date = new Date) => {
  if (name.includes('_')) name = name.split('_')[0]
  date = date.toJSON().split('.')[0].replace(/[^0-9]/g, '-')
  return `${name}_${date}`
}
