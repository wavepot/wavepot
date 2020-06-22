export default () => ({
  keys: {},

  focus: null,

  zoomStart: null,
  zoomTimeout: null,

  didMove: false,

  drawing: false,
  drawingTimeout: null,

  dragTimer: 0,

  litColumn: 2
})
