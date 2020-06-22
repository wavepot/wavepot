export default ({ grid }) => ({
  which: 0,
  down: false,
  prev: { x: 0, y: 0, d: 0 }, // old float position in px
  px: { x: 0, y: 0, d: 0 }, // float position in px
  pos: { x: 0, y: 0 }, // float position in squares
  square: { x: 0, y: 0 }, // int position (actual square)
  parseEvent (e) {
    this.which = e.which
    let x, y, d = 0
    if (e.targetTouches) {
      if (e.targetTouches.length >= 1) {
        x = e.targetTouches[0].pageX
        y = e.targetTouches[0].pageY
      }
      if (e.targetTouches.length >= 2) {
        d = Math.sqrt(
          Math.pow(e.targetTouches[1].pageX - x, 2) +
          Math.pow(e.targetTouches[1].pageY - y, 2)
        ) / 400
      }
    } else {
      x = e.clientX
      y = e.clientY
      d = (e.deltaY || 0) / 1000
    }
    return { x, y, d }
  },
  update ({ x = this.px.x, y = this.px.y, d = this.px.d }) {
    this.prev.x = this.prev.x
    this.prev.y = this.prev.y
    this.prev.d = this.prev.d

    this.px.x = x
    this.px.y = y
    this.px.d = d

    this.pos.x = this.px.x / grid.zoom - grid.shift.x
    this.pos.y = this.px.y / grid.zoom - grid.shift.y

    this.square = {
      x: Math.floor(this.pos.x),
      y: Math.floor(this.pos.y)
    }
  }
})
