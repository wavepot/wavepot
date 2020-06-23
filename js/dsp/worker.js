import toFinite from '../lib/to-finite.js'
import Context from './context.js'
import render from './render.js'

const worker = {
  fn: null,

  callbacks: {},

  callback ({ callback }) {
    this.callbacks[callback.id](callback.data)
  },

  async setup ({ context }) {
    context = new Context(context)
    const { filename, method } = context

    const module = await import(filename)
    this.fn = module[method.name]

    if (method.type === 'AsyncFunction') {
      context.setupStartTime = performance.now() / 1000
      this.fn = await this.fn(context)
      context.setupDuration = performance.now() / 1000 - context.setupStartTime
    }

    postMessage({ type: 'setup', context })
  },

  render ({ context }) {
    context = new Context(context)
    render(this.fn, context)
    postMessage({ type: 'render', context })
  }
}

onmessage = ({ data }) => worker[data.type](data)
