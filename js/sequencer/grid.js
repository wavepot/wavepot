const offsetOf = v => v >= 0 ? v - Math.floor(v) : 1 - offsetOf(-v)

let gridValues = new Set

export default class Grid extends EventTarget {
  constructor ({ state }, storage, tileFactory) {
    super()
    this.state = state
    this.storage = storage
    this.squares = new Map
    this.tileFactory = tileFactory
    this.canvas = document.createElement('canvas')
    this.canvas.style.position = 'fixed'
    this.ctx = this.canvas.getContext('2d')
    this.screen = { width: 1000, height: 1000 } // in px
    this.size = { width: 0, height: 0 } // size in squares
    this.shift = { x: 16, y: 8 } // shift in squares
    this.offset = { x: 0, y: 0 } // offset in squares
    this.playingPosition = -1
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
      lit: '#eee',
      range: '#fff',
      rangebar: '#000',
    }
    this.resize(true)
  }

  async load () {
    const gridState = JSON.parse((await this.storage.getItem('gridState')) ?? '{}')
    this.setShift(gridState.shift ?? this.shift)
    this.setScale(gridState.scale ?? this.scale)

    const gridTiles = new Map(JSON.parse((await this.storage.getItem('gridTiles')) ?? '[]'))
    for (const [hashPos, [length, id]] of gridTiles) {
      const tile = await this.tileFactory(this.hashToPos(hashPos), length, id)
      for (const square of tile.squares) {
        this.squares.set(this.posToHash(square), tile)
      }
    }
  }

  async saveState () {
    await this.storage.setItem('gridState', JSON.stringify(this))
    this.dispatchEvent(new CustomEvent('change'))
  }

  async saveTiles () {
    await this.storage.setItem('gridTiles', JSON.stringify(this.tiles))
    this.dispatchEvent(new CustomEvent('change'))
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

  drawPlaybackRange () {
    if (!this.playbackRange) this.updatePlaybackRange()
    const { left, top, right, bottom } = this.playbackRange
    this.ctx.fillStyle = this.colors.range
    this.ctx.fillRect(
      Math.floor(this.zoom * (left + this.shift.x)) - 1,
      Math.floor(this.zoom * (top + this.shift.y)) - 1,
      Math.round(this.zoom * (right - left + 1)) + 1,
      Math.round(this.zoom * (bottom - top + 1)) + 1
    )
  }

  drawGrid () {
    this.ctx.lineWidth = Math.min(1, .02 + this.zoom / 55)

    const { left, top, right, bottom } = this.playbackRange

    const shift = {
      x: Math.floor(this.shift.x),
      y: Math.floor(this.shift.y)
    }

    const offset = {
      x: this.offset.x * this.zoom,
      y: this.offset.y * this.zoom
    }

    for (let x = 0; x < this.size.width; x++) {
      if (x - shift.x === this.playingPosition) {
        this.ctx.fillStyle = this.colors.lit
        this.ctx.fillRect(Math.floor(x * this.zoom + offset.x), 0, this.zoom, this.screen.height)
      }
      this.ctx.strokeStyle = this.colors[
        (x - shift.x === left || x - shift.x === right + 1) ? 'rangebar' :
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
        (y - shift.y === top || y - shift.y === bottom + 1) ? 'rangebar' :
        (y - shift.y) % 4 === 0
          ? (y - shift.y) % 16 === 0
            ? 'verse'
            : 'phrase'
          : 'grid'
        ]
      this.drawHorizontalLine(Math.floor(y * this.zoom + offset.y) - .5)
    }
  }

  drawTiles () {
    const squares = this.getVisibleSquares()
    squares.forEach(([pos, tile]) => {
      if (pos === this.posToHash(tile.pos)
        || this.hashToPos(pos).x === -Math.ceil(this.shift.x)) {
        tile.draw(true)
      }
    })
    return squares
  }

  updatePlaybackRange () {
    this.playbackRange = this.getPlaybackRange()
  }

  getPlaybackRange () {
    const audibleSquares = this.getAudibleSquares()
      .map(([pos]) => this.hashToPos(pos))

    if (!audibleSquares.length) return {
      left: Math.ceil(-this.shift.x),
      top: Math.ceil(-this.shift.y),
      right: Math.ceil(-this.shift.x),
      bottom: Math.ceil(-this.shift.y)
    }

    const horiz = audibleSquares.slice()
      .sort((a, b) => a.x > b.x ? 1 : a.x < b.x ? -1 : 0)
    const left = horiz[0].x
    const right = horiz.pop().x

    const vert = audibleSquares.slice()
      .sort((a, b) => a.y > b.y ? 1 : a.y < b.y ? -1 : 0)
    const top = vert[0].y
    const bottom = vert.pop().y

    return { left, top, right, bottom }
  }

  getNextPlaybackTiles () {
    const x = this.getNextPlaybackPosition()
    return this.getAudibleSquares(this.playbackRange)
      .filter(([pos]) => x === this.hashToPos(pos).x)
      .map(([_, tile]) => tile)
      // bottom first
      .sort((b, a) => a.pos.y > b.pos.y ? 1 : a.pos.y < b.pos.y ? -1 : 0)
  }

  getNextPlaybackPosition () {
    const { left, right } = this.playbackRange
    let x = this.playingPosition + 1
    if (x < left || x > right) {
      x = left
    }
    return x
  }

  advancePlaybackPosition () {
    this.playingPosition = this.getNextPlaybackPosition()
    this.draw()
  }

  getVisibleSquares (range = this.getVisibleRange()) {
    return [...this.squares]
      .filter(([pos]) => this.isVisiblePos(this.hashToPos(pos), range))
  }

  getAudibleSquares (range = this.getAudibleRange()) {
    return [...this.squares]
      .filter(([pos]) => this.isAudiblePos(this.hashToPos(pos), range))
  }

  getVisibleRange () {
    return {
      left: Math.floor(-this.shift.x),
      top: Math.floor(-this.shift.y),
      right: Math.ceil(-this.shift.x + this.size.width),
      bottom: Math.ceil(-this.shift.y + this.size.height)
    }
  }

  getAudibleRange () {
    return {
      left: Math.ceil(-this.shift.x),
      top: Math.ceil(-this.shift.y),
      right: Math.floor(-this.shift.x + this.size.width) - Math.min(1, this.size.width),
      bottom: Math.floor(-this.shift.y + this.size.height) - Math.min(1, this.size.height)
    }
  }

  isVisiblePos ({ x, y }, { left, top, right, bottom }) {
    return (
      x >= left &&
      y >= top &&
      x < right &&
      y < bottom
    )
  }

  isAudiblePos ({ x, y }, { left, top, right, bottom }) {
    return (
      x >= left &&
      y >= top &&
      x <= right &&
      y <= bottom
      // Math.floor(x + Math.min(1, this.size.width)) <= right &&
      // Math.floor(y + Math.min(1, this.size.height)) <= bottom
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

  async addTile (pos, length = 1) {
    const tile = await this.tileFactory(pos, length)
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
    this.screen.width = this.canvas.width = document.documentElement.clientWidth - 170
    this.screen.height = this.canvas.height = document.documentElement.clientHeight
    if (!initial) this.setScale(this.scale)
  }

  clear () {
    this.ctx.fillStyle = this.colors.back
    this.ctx.fillRect(0, 0, this.screen.width, this.screen.height)
  }

  draw () {
    this.clear()
    this.drawPlaybackRange()
    this.drawGrid()
    this.drawTiles()
  }
}
