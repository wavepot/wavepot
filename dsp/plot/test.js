import Plot from './index.js'

const frames = 44100

const plot = Plot(frames, { zoom: 1, height: 20, width: 60 })

for (var i = 0, t = 0; i < frames; i++, t+=1/frames*4) {
  plot()
  plot(Math.sin(t * Math.PI / 2 * 1))
  plot(Math.sin(t * Math.PI / 2 * 2))
  plot(Math.sin(t * Math.PI / 2 * 4))
  plot(Math.sin(t * Math.PI / 2 * 440))
  plot(Math.sin(t * Math.PI / 2 * 880))
}
