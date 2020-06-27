import Sequencer from './sequencer/sequencer.js'
import Clock from './clock.js'
import DynamicCache from './dynamic-cache.js'
import ScriptNode from './script/node.js'
import singleGesture from './lib/single-gesture.js'
import readTracks from './read-tracks.js'

const DEFAULT_OPTIONS = {
  bpm: 120
}

const readFilenameFromCode = code => {
  code = code.trim()
  if (code[0] === '`') {
    const nextBackquoteIndex = code.indexOf('`', 1)
    const filename = code
      .slice(1, nextBackquoteIndex)
      .toLowerCase()
      .replace(/[^a-z0-9-_./]{1,}/gm, '-')
    return filename
  }
}

DynamicCache.install()

export default class Wavepot {
  constructor (opts = {}) {
    Object.assign(this, DEFAULT_OPTIONS, opts)
    this.el = opts.el
    this.cache = new DynamicCache('wavepot', { 'Content-Type': 'application/javascript' })
    this.nodes = new Map
    this.clock = new Clock()
    this.onbar = this.onbar.bind(this)
    singleGesture(() => this.start())
    this.createSequencer(localStorage)
    this.playingNodes = []
    this.prevPlayingNodes = []
    this.mode = 'sequencer'
  }

  createSequencer (storage) {
    this.sequencer = Sequencer(this.el, storage)
    this.sequencer.addEventListener('export', ({ detail: fullState }) => {
      const filename = `wavepot-${new Date().toJSON().split('.')[0].replace(/[^0-9]/g, '-')}.json`
      const file = new File([fullState], filename, { type: 'application/json' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(file)
      a.download = filename
      a.click()
    })
    this.sequencer.addEventListener('import', () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      input.onchange = e => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.readAsText(file, 'utf-8')
        reader.onload = e => {
          const fullState = JSON.parse(e.target.result)
          for (const [key, value] of Object.entries(fullState)) {
            localStorage.setItem(key, value)
          }
          // const proxyStorage = {
          //   getItem (key) {
          //     return fullState[key] ?? localStorage.getItem(key)
          //   },
          //   setItem (key, value) {
          //     return localStorage.setItem(key, value)
          //   }
          // }
          this.sequencer.destroy()
          this.createSequencer(localStorage)
        }
      }
      input.click()
    })
    this.sequencer.addEventListener('live', () => {
      // TODO: just a toggle for now
      if (this.mode === 'sequencer') {
        this.mode = 'live'
      } else {
        this.mode = 'sequencer'
      }
      console.log('set mode', this.mode)
    })
    this.sequencer.addEventListener('save', ({ detail: tile }) => {
      this.updateNode(tile)
    })
    this.sequencer.addEventListener('change', ({ detail: tile }) => {
      if (this.mode === 'live') {
        this.updateNode(tile)
      }
    })
    this.sequencer.addEventListener('play', () => {
      const { grid } = this.sequencer
      this.start()
      grid.updatePlaybackRange()
      if (!this.clock.started) {
        this.clock.start()
        this.scheduleNextNodes()
      } else {
        this.clock.stop()
        this.prevPlayingNodes.forEach(node => node.stop())
        this.playingNodes.forEach(node => node.stop())
      }
    })
    this.sequencer.addEventListener('pause', () => {
      this.clock.stop()
      this.prevPlayingNodes.forEach(node => node.stop())
      this.playingNodes.forEach(node => node.stop())
    })
    this.sequencer.addEventListener('load', async () => {
      console.log('project loading...')
      await Promise.all([...this.sequencer.editors.values()].map(instance => this.saveEditor(instance.editor)))
      console.log('cached editors complete')
    })
  }

  onbar () {
    const { grid } = this.sequencer
    grid.advancePlaybackPosition()
    this.scheduleNextNodes()
  }

  start () {
    if (this.context) return
    console.log('audio start', this)
    this.context = this.audioContext = new AudioContext({
      numberOfChannels: 2,
      sampleRate: 44100
    })
    this.context.destination.addEventListener('bar', this.onbar)
    this.clock.connect(this.context.destination, this.bpm)
    this.clock.reset()
  }

  async scheduleNextNodes () {
    const { grid } = this.sequencer
    const nodes = await this.getNodes(grid.getNextPlaybackTiles())

    let prev = null
    let chain = []
    let chains = []
    for (const node of nodes) {
      if (prev && prev.tile.pos.y !== node.tile.pos.y + 1) {
        chains.push(chain)
        chain = []
      }
      chain.unshift(node)
      prev = node
    }
    chains.push(chain)

    chains = await Promise.all(chains.filter(chain => chain.length).map(chain => this.renderChain(chain)))

    const syncTime = this.clock.sync[this.mode === 'sequencer' ? 'bar' : 'beat']
    this.prevPlayingNodes = this.playingNodes.slice()
    this.playingNodes.forEach(node => node.stop(syncTime))
    this.playingNodes = chains.map(chain => chain.node.start(chain.bar, syncTime))
  }

  async getNodes (tiles) {
    const nodes = await Promise.all(tiles.map(tile => this.getNode(tile)))
    return nodes.filter(Boolean)
  }

  getNode (tile) {
    return this.nodes.get(tile) ?? this.updateNode(tile)
  }

  async renderChain (chain) {
    const { grid } = this.sequencer
    const x = grid.getNextPlaybackPosition()
    const last = chain.pop()

    let input
    for (const node of chain) {
      input = await node.render(x - node.tile.pos.x, input, true)
    }

    const bar = x - last.tile.pos.x
    await last.render(bar, input)

    return { bar, node: last } //.start(bar, syncTime)
  }

  async updateNode (tile) {
    const filename = await this.saveEditor(tile.instance.editor)
    const methods = await readTracks(filename)
    if (!methods.default) return

    const node = new ScriptNode(
      this.audioContext,
      filename,
      methods.default,
      this.clock.bpm,
      tile.length
    )
    node.connect(this.audioContext.destination)
    node.tile = tile
    await node.setup()
    this.nodes.set(tile, node)

    return node
  }

  async saveEditor (editor) {
    const code = editor.value
    const filename = readFilenameFromCode(code)
    return await this.cache.put(filename, code)
  }
}
//   getLoopBuffer (opts) {
//     const loopBufferPool = this.getLoopBufferPool(opts)
//     const loopBuffer = loopBufferPool.get()
//     loopBuffer.onended = () => loopBufferPool.release(loopBuffer)
//     return loopBuffer
//   }

//   getLoopBufferPool ({ numberOfChannels, numberOfBars, sampleRate }) {
//     const key = [numberOfChannels, numberOfBars, sampleRate].join()
//     if (!(key in this.pools)) {
//       this.pools[key] = new Pool(
//         () => new LoopBuffer({
//           audioContext: this.audioContext,
//           numberOfChannels,
//           numberOfBars,
//           sampleRate,
//           barLength: this.clock.lengths.bar
//         })
//       )
//     }
//     return this.pools[key]
//   }

//   async play (script, filename = 'dsp.js', syncType = 'bar') {
//     filename = await this.cache.put(filename, script)

//     const song = this.songs[filename] = this.songs[filename] ?? new Song(filename)

//     const tracks = await readTracks(filename)

//     for (const [name, track] of song.tracks) {
//       if (!tracks.has(name)) {
//         song.stop(track, syncType)
//       }
//     }
//     for (const [name, track] of tracks) {
//       if (song.tracks.has(name)) {
//         song.update(track, syncType)
//         // on update, don't discard last playing node until
//         // we have the new setup+render done, only at last moment
//         // double buffer on loopscriptnode?
//       } else {
//         song.add(track, syncType)
//       }
//     }
//   }

//   playTrack (track) {
//     if (track.worker) {
//       track.worker.terminate()
//     }

//     const worker = track.worker = new Worker('./dsp-worker.js', { type: 'module' })

//     worker.onmessage = ({ data }) => {
//       switch (data.type) {
//         case 'callback':
//           // TODO
//           break
//         case 'setup':
//           Object.assign(track.context, data.context)
//           this.scheduler()
//           break
//         case 'render':
//           Object.assign(track.context, data.context)
//           this.scheduler()
//           break
//         default:
//           throw new Error('Unsupported message type: ' + data.type)
//       }
//     }

//     worker.onerror = error => {
//       track.context.meta.error = error
//       console.error(error.message, track)
//     }

//     worker.postMessage({
//       type: 'setup',
//       context: track.context
//     })
//   }

//   stopTrack (track) {
//     track.audio.source.stop(this.times.sync)
//     track.audio.reset()
//     this.loopAudioBuffersPool.release(track.audio)
//   }

//   close () {
//     try { this.audioContext.close() } catch {}
//   }
// }

// class Song {
//   constructor (filename) {
//     this.filename = filename
//     this.tracks = new Map
//   }

//   update (track, syncType) {
//     Object.assign(this.tracks.get(track.name), track)
//   }

//   stop (track, syncType) {
//     track.stop(this.clock.s[syncType])
//   }

//   add (track, syncType) {
//     this.tracks.set(track.name, new Track(track))
//   }

//   createTrack (filename, track) {
//     return new Track(filename, track)
//   }
// }

// class Track {
//   constructor (filename, track) {
//     this.filename = filename
//     Object.assign(this, track)
//     this.context = new Context()
//   }
// }
