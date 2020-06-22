export default class Tile {
  constructor (grid, pos, length) {
    this.grid = grid
    this.pos = pos
    this.length = length
  }

  get squares () {
    return Array(this.length)
      .fill(this.pos.x)
      .map((x, i) => ({
        x: x + i,
        y: this.pos.y
      }))
  }

  setLength (newLength) {
    const oldLength = this.length
    const toAdd = []
    const toRemove = []
    if (newLength === oldLength || newLength < 1) return { toAdd, toRemove }
    const oldSquares = this.squares
    this.length = newLength
    const newSquares = this.squares
    for (let x = Math.min(oldLength, newLength); x < Math.max(oldLength, newLength); x++) {
      if (x >= newLength) {
        toRemove.push(oldSquares[x])
      } else if (x >= oldLength) {
        toAdd.push(newSquares[x])
      }
    }
    return { toAdd, toRemove }
  }

  draw () {
    this.grid.ctx.fillStyle = this.grid.colors.square
    this.grid.ctx.fillRect(
      Math.floor(this.grid.zoom * (this.pos.x + this.grid.shift.x)) - 1,
      Math.floor(this.grid.zoom * (this.pos.y + this.grid.shift.y)) - 1,
      Math.round(this.grid.zoom * this.length) + 1,
      Math.round(this.grid.zoom) + 1
    )
  }
}
