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
    this.currentlyPlayingNodes = new Map
    this.clock = new Clock()
    this.onbar = this.onbar.bind(this)
    singleGesture(() => this.start())
    this.createSequencer(localStorage)
    this.playingPosition = -1
  }

  createSequencer (storage) {
    this.sequencer = Sequencer(this.el, storage)
    this.sequencer.addEventListener('change', ({ detail: editor }) => {
      // this.saveEditor(editor)
    })
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
    this.sequencer.addEventListener('save', ({ detail: tile }) => {
      console.log('saving:', tile)
      this.updateNode(tile)
    })
    this.sequencer.addEventListener('play', () => {
      this.start()
      if (!this.clock.started) {
        this.clock.start()
        this.scheduleNextNodes()
      } else {
        this.clock.stop()
        for (const node of this.currentlyPlayingNodes.values()) {
          node.stop()
        }
        for (const node of this.nodes.values()) {
          node.stop()
        }
      }
    })
    this.sequencer.addEventListener('pause', () => {
      this.clock.stop()
      for (const node of this.currentlyPlayingNodes.values()) {
        node.stop()
      }
      for (const node of this.nodes.values()) {
        node.stop()
      }
    })
  }

  onbar () {
    this.currentlyPlayingNodes = new Map([...this.nodes])
    this.advancePlaybackPosition()
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
  }

  async scheduleNextNodes () {
    this
      .getNextPlaybackTiles()
      .forEach(tile => this.playNode(tile))
  }

  async playNode (tile) {
    const [leftMost, rightMost] = this.getPlaybackRange()
    let node = this.nodes.get(tile)
    if (!node) node = await this.updateNode(tile)
    const offset = tile.pos.x < leftMost ? leftMost - tile.pos.x : 0
    const duration = tile.pos.x + tile.length > rightMost
      ? tile.length - (tile.pos.x + tile.length - rightMost - offset) + 1
      : tile.length
    node.start(
      'bar',
      offset,
      duration
    )
  }

  async updateNode (tile) {
    const filename = await this.saveEditor(tile.instance.editor)
    const methods = await readTracks(filename)
    if (!methods.default) return
    console.log('rendering', filename, 'bars', tile.length)
    const node = new ScriptNode(
      this.audioContext,
      filename,
      methods.default,
      this.clock.bpm,
      tile.length
    )
    node.id = tile.id
    node.connect(this.audioContext.destination)
    await node.render()
    this.nodes.set(tile, node)
    return node
  }

  getPlaybackRange () {
    const { grid } = this.sequencer
    const sortedSquares = grid.getAudibleSquares()
      .map(([pos]) => grid.hashToPos(pos))
      .sort((a, b) => a.x > b.x ? 1 : a.x < b.x ? -1 : 0)
    if (!sortedSquares.length) return [-1,-1]
    const leftMost = sortedSquares[0].x
    const rightMost = sortedSquares.pop().x
    return [leftMost, rightMost]
  }

  getNextPlaybackPosition () {
    const [leftMost, rightMost] = this.getPlaybackRange()
    let playingPosition = this.playingPosition + 1
    if (playingPosition > rightMost || playingPosition < leftMost) {
      playingPosition = leftMost
    }
    return playingPosition
  }

  advancePlaybackPosition () {
    this.sequencer.highlightColumn(this.playingPosition)
    this.playingPosition = this.getNextPlaybackPosition()
  }

  getNextPlaybackTiles () {
    const [leftMost, rightMost] = this.getPlaybackRange()
    const x = this.playingPosition
    const { grid } = this.sequencer
    return [...new Map(grid.getAudibleSquares()
      .filter(([pos, tile]) =>
        (grid.hashToPos(pos).x === x &&
        x === tile.pos.x) ||
        tile.pos.x < leftMost && x === leftMost
      )).values()]
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
