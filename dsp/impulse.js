import convolve from './convolve.js'
import fetchSample from './fetch-sample.js'

export default async (context, url) => {
  const impulse = await fetchSample(url)
  const kernel = convolve.fftProcessKernel(context.length, impulse)
  const reverb = convolve.fftConvolution(context.length, kernel, impulse.length)
  context.handle = true
  return reverb
}
