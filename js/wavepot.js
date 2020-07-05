import debounce from './lib/debounce.js'
import dateId from './lib/date-id.js'
import randomId from './lib/random-id.js'
import Sequencer from './sequencer/sequencer.js'
import Storage from './storage.js'
import Library from './library.js'
import Clock from './clock.js'
import DynamicCache from './dynamic-cache.js'
import ScriptNode from './script/node.js'
import singleGesture from './lib/single-gesture.js'
import readFilenameFromCode from './lib/read-filename-from-code.js'
import readTracks from './read-tracks.js'

const DEFAULT_OPTIONS = {
  bpm: 120
}

DynamicCache.install()

export default class Wavepot {
  constructor (opts = {}) {
    Object.assign(this, DEFAULT_OPTIONS, opts)
    this.el = opts.el
    this.storage = new Storage()
    this.cache = new DynamicCache('wavepot', { 'Content-Type': 'application/javascript' })
    this.nodes = new Map()
    this.clock = new Clock()
    this.onbar = this.onbar.bind(this)
    this.playingNodes = []
    this.prevPlayingNodes = []
    this.mode = 'sequencer'
  }

  async init () {
    await this.storage.init()
    this.projects = JSON.parse((await this.storage.getItem('projects')) || '{}')
    this.projectName = await this.storage.getItem('projectName')
    if (!this.projectName) {
      await this.setProjectName('untitled-' + randomId())
    }
    const history = await this.storage.getItem('hist')
    this.history = history?.split(',') ?? []
    this.library = await Library(this, this.el, this.storage)
    this.library.setList('hist', this.history)
    this.library.draw()
    singleGesture(() => this.start())
    this.createSequencer(this.storage)
  }

  async setProjectName (newName, rename = false, old = false) {
    if (!old) while (newName in this.projects) {
      newName = prompt('name already exists, specify new name', newName)
    }
    if (rename) {
      delete this.projects[this.projectName]
    }
    this.projectName = newName
    await this.storage.setItem('projectName', this.projectName)
    await this.save()
    return newName
  }

  async save () {
    this.projects[this.projectName] = this.sequencer.stringify()
    await this.storage.setItem('projects', JSON.stringify(this.projects))
    this.library?.updateList('proj')
  }

  async import (fullState, projectName, old = false) {
    for (const [key, value] of Object.entries(fullState)) {
      await this.storage.setItem(key, value)
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
    await this.createSequencer(this.storage)
    await this.setProjectName(projectName, false, old)
  }

  importDialog () {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = e => {
      const file = e.target.files[0]
      const projectName = file.name.split('.json')[0]
      const reader = new FileReader()
      reader.readAsText(file, 'utf-8')
      reader.onload = async e => {
        const fullState = JSON.parse(e.target.result)
        await this.import(fullState, projectName)
      }
    }
    input.click()
  }

  export (fullStateJson) {
    const filename = dateId(this.projectName) + '.json'
    const file = new File([fullStateJson], filename, { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(file)
    a.download = filename
    a.click()
  }

  createSequencer (storage) {
    return new Promise(resolve => {
      this.sequencer = Sequencer(this.el, storage)
      this.sequencer.addEventListener('export', ({ detail: fullStateJson }) => this.export(fullStateJson))
      this.sequencer.addEventListener('import', () => this.importDialog())
      this.sequencer.addEventListener('live', () => {
        // TODO: just a toggle for now
        if (this.mode === 'sequencer') {
          this.mode = 'live'
        } else {
          this.mode = 'sequencer'
        }
        console.log('set mode', this.mode)
      })
      this.sequencer.addEventListener('save', async ({ detail: tile }) => {
        await this.save()
        await this.addHistory(tile, true)
        this.updateNode(tile)
      })
      this.sequencer.addEventListener('change', debounce(350, async ({ detail: tile }) => {
        if (tile === 'grid') {
          await this.save()
          console.log('saved')
        } else if (this.mode === 'live') {
          await this.save()
          await this.addHistory(tile)
          this.updateNode(tile)
        }
      }))
      this.sequencer.addEventListener('play', () => {
        const { grid } = this.sequencer
        this.start()
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
        this.library.setList('curr', [...this.sequencer.editors.keys()])
        resolve()
      })
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
    this.library.setList('curr', [...this.sequencer.editors.keys()])
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

  async addHistory (tile, force) {
    const code = tile.instance.editor.value
    const filename = readFilenameFromCode(code)
    const prev = this.history.find(name => name.split('.')[0] === filename)
    if ((await this.storage.getItem(prev)) === code) {
      if (!force || (await this.storage.getItem(this.history[0])) === code) {
        return
      }
    }
    const version = (prev ? Number(prev.split('.')[1]) : 0) + 1
    const name = filename + '.' + version
    await this.storage.setItem(name, code)
    this.history.unshift(name)
    await this.storage.setItem('hist', this.history.join())
    this.library.setList('hist', this.history)
  }

  async clearHistory () {
    const favs = ((await this.storage.getItem('favs'))?.split(',') ?? []).filter(Boolean)
    const toDelete = []
    this.history = this.history.filter(name => {
      const shouldDelete = !favs.includes(name)
      if (shouldDelete) {
        toDelete.push(name)
      }
      return !shouldDelete
    })
    await Promise.all(toDelete.map(name => this.storage.removeItem(name)))
    await this.storage.setItem('hist', this.history.join())
    this.library.setList('hist', this.history)
  }

  async saveEditor (editor) {
    const code = editor.value
    const filename = readFilenameFromCode(code)
    return await this.cache.put(filename, code)
  }
}
