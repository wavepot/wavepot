import Sequencer from 'sequencer'
import Clock from './clock.js'
import DynamicCache from './dynamic-cache.js'
import LoopScriptNode from './loop-script/node.js'
import singleGesture from './lib/single-gesture.js'

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

export default class Wavepot {
  constructor (opts = {}) {
    Object.assign(this, DEFAULT_OPTIONS, opts)
    this.cache = new DynamicCache('wavepot', { 'Content-Type': 'application/json' })
    this.clock = new Clock()
    this.onbar = this.onbar.bind(this)
    this.sequencer = Sequencer(opts.el, localStorage)
    this.sequencer.addEventListener('change', ({ detail: editor }) => {
      console.log('changed:', editor)
      saveEditor(editor)
    })
    singleGesture(() => {
      console.log('audio start', this)
      this.context = this.audioContext = new AudioContext({
        numberOfChannels: 2,
        sampleRate: 44100
      })
      this.context.destination.addEventListener('bar', this.onbar)
      this.clock.connect(this.context.destination, this.bpm)
      this.clock.start()
    })
    this.playingPosition = -1
  }

  onbar () {
    const grid = this.sequencer.grid
    const sortedSquares = grid
      .getAudibleSquares()
      .map(([pos]) => grid.hashToPos(pos))
      .sort((a, b) => a.x > b.x ? 1 : a.x < b.x ? -1 : 0)

    const leftMost = sortedSquares[0].x
    const rightMost = sortedSquares.pop().x

    this.playingPosition++

    if (this.playingPosition > rightMost || this.playingPosition < leftMost) {
      this.playingPosition = leftMost
    }

    this.sequencer.highlightColumn(this.playingPosition)
  }

  async saveEditor (editor) {
    const code = editor.instance.value
    const filename = readFilenameFromCode(code)
    await this.cache.put(filename, code)
    console.log('saved:', filename)
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
