export default function Plot (frames, opts) {
  const plots = []
  let id = -1
  let frame = -1

  function draw (samples) {
    self.postMessage({
      plot: {
        buffer: samples.buffer,
        pos: samples.pos,
        opts
      }
    })
  }

  return function plot (value = null, y = 1) {
    if (value === null) {
      id = -1
      frame++
    } else {
      id++
      if (!(id in plots)) {
        const buffer = new SharedArrayBuffer(frames * Float32Array.BYTES_PER_ELEMENT)
        plots[id] = new Float32Array(buffer)
        const [ line, column ] = (new Error()).stack.split('\n')[2].split(':').slice(3)
        plots[id].pos = { line: parseInt(line)-1, ch: parseInt(column)-1 }
      }
      plots[id][frame] = value * y
      if (frame === frames - 1) draw(plots[id])
    }
    return value
  }
}
