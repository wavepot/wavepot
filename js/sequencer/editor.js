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

export default class Editor {
  static createInstance (value = '') {
    const instance = new Primrose(primroseOptions)
    instance.theme = theme
    instance.value = value
    return instance
  }

  constructor (grid, square, instance) {
    this.id = instance?.id ?? (Math.random() * 10e6 | 0).toString(36)
    this.instance = instance?.id ? instance : Editor.createInstance(instance)
    this.instance.id = this.id
    this.updateId = this.instance.updateId = this.instance.updateId ?? 0
    this.square = square
    this.offset = { x: 0, y: 0 }
    this.scale = 1
    this.zoomThreshold = 1300
    this.drawListener = this.draw.bind(this, grid)
    this.drawMicrotaskScheduled = false
    this.drawDebounce = () => {
      if (!this.drawMicrotaskScheduled) {
        this.drawMicrotaskScheduled = true
        queueMicrotask(this.drawListener)
      }
    }
    this.instance.addEventListener('update', this.drawDebounce)
  }

  toJSON () {
    return this.id
  }

  destroy () {
    this.instance.removeEventListener('update', this.drawDebounce)
  }

  focus () {
    this.instance.focus()
  }

  blur () {
    this.instance.blur()
  }

  draw (grid) {
    this.drawMicrotaskScheduled = false
    if (grid.zoom < 14) return
    const { x, y } = this.square
    let { zoom } = grid
    zoom = Math.floor(zoom)

    if (this.instance.updateId === this.updateId) {
      this.instance.updateId++

      const screen = grid.screen
      const larger = Math.max(screen.width, screen.height)

      this.scale = 1
      // TODO: do this on zoom rest instead
      if (zoom - this.zoomThreshold > larger) {
        this.scale = larger / (zoom - this.zoomThreshold)
      }

      this.instance.setSize(zoom * this.scale, zoom * this.scale)
    }
    this.updateId = this.instance.updateId

    this.offset = {
      x: Math.floor(x * grid.zoom + grid.shift.x * grid.zoom),
      y: Math.floor(y * grid.zoom + grid.shift.y * grid.zoom)
    }

    grid.ctx.imageSmoothingEnabled = false
    grid.ctx.drawImage(
      this.instance.canvas,
      this.offset.x,
      this.offset.y,
      zoom,
      zoom
    )
  }
}
