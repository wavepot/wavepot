export default () => ({
  keys: {},

  focus: null,
  brush: null,
  grabbed: null,
  resizing: null,

  zoomStart: null,
  zoomTimeout: null,

  didMove: false,

  drawing: false,
  drawingTimeout: null,

  dragTimer: 0,

  litColumn: null
})
