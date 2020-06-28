import randomId from '../lib/random-id.js'
import Tile from './tile.js'
import { Primrose } from 'primrose'

export const primroseOptions = {
  wordWrap: false,
  lineNumbers: false,
  fontSize: 16,
  padding: 0,
  width: 512,
  height: 512,
  scaleFactor: 1
}

export const theme = {
  name: 'Darker',
  cursorColor: 'white',
  unfocused: 'rgba(0,0,0,0)',
  currentRowBackColor: '#202020',
  selectedBackColor: '#404040',
  lineNumbers: {
    foreColor: 'white'
  },
  regular: {
    backColor: 'black',
    foreColor: '#ccc'
  },
  strings: {
    foreColor: '#fff',
  },
  regexes: {
    foreColor: '#fff',
    fontStyle: 'italic'
  },
  numbers: {
    foreColor: '#fff'
  },
  comments: {
    foreColor: '#555',
  },
  keywords: {
    foreColor: '#666'
  },
  operators: {
    foreColor: '#ccc'
  },
  symbol: {
    foreColor: '#ccc'
  },
  declare: {
    foreColor: '#ddd'
  },
  functions: {
    foreColor: '#ddd',
  },
  special: {
    foreColor: '#ddd',
  },
  members: {
    foreColor: '#aaa'
  },
  error: {
    foreColor: 'red',
    fontStyle: 'underline'
  }
}

const ZOOM_THRESHOLD = 1300

class Editor {
  constructor (env, id, value) {
    this.id = id
    this.editor = new Primrose(primroseOptions)
    this.editor.theme = theme
    this.editor.value = value
    Primrose.add(env, this.editor)
  }
}

export default class ScriptTile extends Tile {
  constructor (grid, pos, length, instanceOrValue) {
    super(grid, pos, length)

    this.id = instanceOrValue?.id ?? randomId()

    this.instance = instanceOrValue?.id
      ? instanceOrValue
      : new Editor(grid, this.id, instanceOrValue)

    this.scale = 1
    this.offset = { x: 0, y: 0 }

    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')

    this.drawHash = null
    this.drawValues = { x: 0, y: 0, width: 0, height: 0 }
    this.updateDraw = this.draw.bind(this, false, true)
    // this.updateId = this.instance.updateId = this.instance.updateId ?? 0

    // this.drawListener = this.draw.bind(this, grid)
    // this.drawMicrotaskScheduled = false
    // this.drawDebounce = () => {
    //   if (!this.drawMicrotaskScheduled) {
    //     this.drawMicrotaskScheduled = true
    //     queueMicrotask(this.drawListener)
    //   }
    // }
    // this.instance.addEventListener('update', this.drawDebounce)
    this.instance.editor.addEventListener('change', this.updateDraw)
  }

  toJSON () {
    return [this.length, this.id]
  }

  destroy () {
    this.instance.editor.removeEventListener('change', this.updateDraw)
    this.instance.editor.removeEventListener('update', this.updateDraw)
    // this.instance.removeEventListener('update', this.drawDebounce)
  }

  focus () {
    this.hasFocus = true
    this.instance.editor.focus()
    this.instance.editor.addEventListener('update', this.updateDraw)
  }

  blur () {
    this.hasFocus = false
    this.instance.editor.blur()
    this.instance.editor.removeEventListener('update', this.updateDraw)
    this.draw(false, true)
  }

  draw (withSquare, isUpdate) {
    if (withSquare === true) {
      super.draw()
    }

    // this.drawMicrotaskScheduled = false
    if (this.grid.zoom < 14) return

    const drawHash = [
      this.grid.zoom,
      this.grid.shift.x,
      this.grid.shift.y,
      this.grid.screen.width,
      this.grid.screen.height
    ].join()

    if (this.hasFocus || drawHash !== this.drawHash) {
      this.drawHash = drawHash

      const floorZoom = Math.floor(this.grid.zoom)

      // if (this.instance.updateId === this.updateId) {
        // this.instance.updateId++
      const xPos = Math.max(this.pos.x, -this.grid.shift.x)
      const rightCut = (xPos - this.pos.x) * this.grid.zoom
      // console.log(rightCut)

      const larger = Math.max(this.grid.screen.width, this.grid.screen.height)

      this.scale = 1
      // TODO: do this on zoom rest instead
      if (floorZoom - ZOOM_THRESHOLD > larger) {
        this.scale = larger / (floorZoom - ZOOM_THRESHOLD)
      }

      const newWidth = floorZoom * this.scale * this.length - rightCut
      const newHeight = floorZoom * this.scale
      if (newWidth <= 1) return

      const canvasWidth = floorZoom * this.length - rightCut
      const canvasHeight = floorZoom
      if (canvasWidth <= 1) return

      this.instance.editor.setSize(newWidth, newHeight)
      this.canvas.width = newWidth
      this.canvas.height = newHeight
      // }
      // this.updateId = this.instance.updateId

      this.offset = {
        x: Math.floor(this.grid.zoom * (xPos + this.grid.shift.x)),
        y: Math.floor(this.grid.zoom * (this.pos.y + this.grid.shift.y))
      }

      this.drawValues = {
        x: this.offset.x,
        y: this.offset.y,
        width: canvasWidth,
        height: canvasHeight
      }

      isUpdate = true
    }

    if (isUpdate) {
      this.ctx.imageSmoothingEnabled = false
      this.ctx.drawImage(
        this.instance.editor.canvas,
        0, 0,
        this.drawValues.width,
        this.drawValues.height
      )
    }

    this.grid.ctx.imageSmoothingEnabled = false
    this.grid.ctx.drawImage(
      this.canvas,
      this.drawValues.x,
      this.drawValues.y,
      this.drawValues.width,
      this.drawValues.height
    )
  }
}
