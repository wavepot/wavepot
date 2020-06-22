const offsetOf = v => v >= 0 ? v - Math.floor(v) : 1 - offsetOf(-v)

let gridValues = new Set

export default class Grid {
  constructor ({ state }, storage, tileFactory) {
    this.state = state
    this.storage = storage
    this.squares = new Map
    this.tileFactory = tileFactory
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.screen = { width: 1000, height: 1000 } // in px
    this.size = { width: 0, height: 0 } // size in squares
    this.shift = { x: 16, y: 8 } // shift in squares
    this.offset = { x: 0, y: 0 } // offset in squares
    this.zoom = -1
    this.scale = 3
    this.maxScale = 6
    this.colors = {
      back: '#ddd',
      grid: '#ccc',
      phrase: '#bbb',
      verse: '#999',
      square: '#000',
      pointer: '#000',
      lit: '#d2d2d2',
    }
    this.resize(true)
  }

  load () {
    const gridState = JSON.parse(this.storage.getItem('gridState') ?? '{}')
    this.setShift(gridState.shift ?? this.shift)
    this.setScale(gridState.scale ?? this.scale)

    const gridTiles = new Map(JSON.parse(this.storage.getItem('gridTiles') ?? '[]'))
    for (const [hashPos, [length, id]] of gridTiles) {
      const tile = this.tileFactory(this.hashToPos(hashPos), length, id)
      for (const square of tile.squares) {
        this.squares.set(this.posToHash(square), tile)
      }
    }
  }

  saveState () {
    this.storage.setItem('gridState', JSON.stringify(this))
  }

  saveTiles () {
    this.storage.setItem('gridTiles', JSON.stringify(this.tiles))
  }

  get tiles () {
    return [...this.squares].filter(([pos, tile]) => pos === this.posToHash(tile.pos))
  }

  toJSON () {
    return {
      shift: this.shift,
      scale: this.scale
    }
  }

  posToHash (pos) {
    return `${pos.x},${pos.y}`
  }

  hashToPos (hashPos) {
    const [x, y] = hashPos.split(',').map(parseFloat)
    return { x, y }
  }

  setShift ({ x, y }) {
    this.shift.x = x
    this.shift.y = y
    this.offset.x = offsetOf(this.shift.x)
    this.offset.y = offsetOf(this.shift.y)
    this.saveState()
  }

  setScale (scale) {
    this.scale =
      Math.max(
        Math.log(2),
        Math.min(
          Math.max(
            Math.log(this.screen.height * this.maxScale),
            Math.log(this.screen.width * this.maxScale)
          ),
          scale
        )
      )

    this.zoom =
      Math.max(
        2,
        Math.min(
          Math.max(
            this.screen.height * this.maxScale,
            this.screen.width * this.maxScale
          ),
          Math.exp(this.scale)
        )
      )

    // snap to pixels if quick scroll
    // TODO: snap to pixels on debounce
    // if (this.zoom > 22) {
      // if (Date.now() - this.state.zoomStart < 350) {
        // this.zoom = Math.round(this.zoom)
      // }
    // }

    this.size.width = this.screen.width / this.zoom
    this.size.height = this.screen.height / this.zoom

    this.saveState()
  }

  drawHorizontalLine (y) {
    this.ctx.beginPath()
    this.ctx.moveTo(0, y)
    this.ctx.lineTo(this.screen.width, y)
    this.ctx.stroke()
  }

  drawVerticalLine (x) {
    this.ctx.beginPath()
    this.ctx.moveTo(x, 0)
    this.ctx.lineTo(x, this.screen.height)
    this.ctx.stroke()
  }

  drawGrid () {
    this.ctx.save()
    this.ctx.lineWidth = Math.min(1, .02 + this.zoom / 55)

    const shift = {
      x: Math.floor(this.shift.x),
      y: Math.floor(this.shift.y)
    }

    const offset = {
      x: this.offset.x * this.zoom,
      y: this.offset.y * this.zoom
    }

    for (let x = 0; x < this.size.width; x++) {
      if (x - shift.x === this.state.litColumn) {
        this.ctx.fillStyle = this.colors.lit
        this.ctx.fillRect(Math.floor(x * this.zoom + offset.x), 0, this.zoom, this.screen.height)
      }
      this.ctx.strokeStyle = this.colors[
        (x - shift.x) % 4 === 0
          ? (x - shift.x) % 16 === 0
            ? 'verse'
            : 'phrase'
          : 'grid'
        ]
      this.drawVerticalLine(Math.floor(x * this.zoom + offset.x) - .5)
    }

    for (let y = 0; y < this.size.height; y++) {
      this.ctx.strokeStyle = this.colors[
        (y - shift.y) % 4 === 0
          ? (y - shift.y) % 16 === 0
            ? 'verse'
            : 'phrase'
          : 'grid'
        ]
      this.drawHorizontalLine(Math.floor(y * this.zoom + offset.y) - .5)
    }

    this.ctx.restore()
  }

  drawTiles () {
    const squares = this.getVisibleSquares()
    squares.forEach(([pos, tile]) => {
      if (pos === this.posToHash(tile.pos)) {
        tile.draw(true)
      }
    })
    return squares
  }

  getVisibleSquares () {
    return [...this.squares]
      .filter(([pos]) => this.isVisiblePos(this.hashToPos(pos)))
  }

  getAudibleSquares () {
    return [...this.squares]
      .filter(([pos]) => this.isAudiblePos(this.hashToPos(pos)))
  }

  isVisiblePos ({ x, y }) {
    return (
      x >= Math.floor(-this.shift.x) &&
      y >= Math.floor(-this.shift.y) &&
      x < Math.ceil(-this.shift.x + this.size.width) &&
      y < Math.ceil(-this.shift.y + this.size.height)
    )
  }

  isAudiblePos ({ x, y }) {
    return (
      x >= Math.ceil(-this.shift.x) &&
      y >= Math.ceil(-this.shift.y) &&
      Math.floor(x + Math.min(1, this.size.width)) <= Math.floor(-this.shift.x + this.size.width) &&
      Math.floor(y + Math.min(1, this.size.height)) <= Math.floor(-this.shift.y + this.size.height)
    )
  }

  hasSquare (pos, length = 1, excludeTile) {
    for (let x = pos.x; x < pos.x + length; x++) {
      const hashPos = this.posToHash({ x, y: pos.y })
      if (this.squares.has(hashPos) && this.squares.get(hashPos) !== excludeTile) return true
    }
    return false
  }

  getTile (pos) {
    return this.squares.get(this.posToHash(pos))
  }

  addTile (pos, length = 1) {
    const tile = this.tileFactory(pos, length)
    for (const square of tile.squares) {
      this.squares.set(this.posToHash(square), tile)
    }
    this.draw()
    this.saveTiles()
    return tile
  }

  setTileLength (tile, newLength) {
    const { toAdd, toRemove } = tile.setLength(newLength)
    for (const square of toRemove) {
      this.squares.delete(this.posToHash(square))
    }
    for (const square of toAdd) {
      this.squares.set(this.posToHash(square), tile)
    }
    this.draw()
    this.saveTiles()
    return tile
  }

  moveTile (tile, toPos) {
    const oldSquares = tile.squares
    tile.pos = { ...toPos }
    const newSquares = tile.squares
    for (const square of oldSquares) {
      this.squares.delete(this.posToHash(square))
    }
    for (const square of newSquares) {
      this.squares.set(this.posToHash(square), tile)
    }
    this.draw()
    this.saveTiles()
  }

  removeTile (pos) {
    const tile = this.getTile(pos)
    for (const square of tile.squares) {
      this.squares.delete(this.posToHash(square))
    }
    tile.destroy()
    this.draw()
    this.saveTiles()
    return tile
  }

  resize(initial = false) {
    this.screen.width = this.canvas.width = document.documentElement.clientWidth
    this.screen.height = this.canvas.height = document.documentElement.clientHeight
    if (!initial) this.setScale(this.scale)
  }

  clear () {
    this.ctx.fillStyle = this.colors.back
    this.ctx.fillRect(0, 0, this.screen.width, this.screen.height)
  }

  draw () {
    this.clear()
    this.drawGrid()
    this.drawTiles()
  }
}
