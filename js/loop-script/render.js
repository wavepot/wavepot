import toFinite from '../lib/to-finite.js'

export default (fn, context) => {
  const { output, length, meta, setup } = context

  meta.renderStartTime = performance.now() / 1000

  if (setup?.handle) {
    fn(context)
    context.n += length // increment sample to one length
  } else {
    if (output.length === 1) {
      renderMono(fn, context)
    } else {
      renderMulti(fn, context)
    }
  }

  meta.renderDuration = performance.now() / 1000 - meta.renderStartTime
}

const renderMono = (fn, context) => {
  const { output, length } = context

  for (let i = context.startIndex ?? 0; //
    i < length; // render one length
    i++,
    context.n++ // increment sample position
  ) {
    output[0][i] = toFinite(fn(context))
  }
}

const renderMulti = (fn, context) => {
  const { output, length } = context
  const channels = output.length

  for (let i = context.startIndex ?? 0,
    channel = 0,
    sample = [];
    i < length; // render one length
    i++,
    context.n++ // increment sample position
  ) {
    sample = fn(context)
    for (channel = 0; channel < channels; channel++) {
      output[channel][i] = toFinite(sample[channel])
    }
  }
}
