import State from './state.js'
import Grid from './grid.js'
import Mouse from './mouse.js'
import ScriptTile from './script-tile.js'
import { Primrose } from 'primrose'

export default (el, storage) => {
  const app = new EventTarget

  if (window.DEBUG) window.app = app

  const editors = app.editors = new Map
  const state = app.state = State()
  const grid = app.grid = new Grid(app, storage, function (pos, length, id, value) {
    if (id) {
      let instance = editors.get(id)
      if (!instance) {
        const value = storage.getItem(id)
        const tile = new ScriptTile(this, pos, length, value)
        tile.id = id
        tile.instance.id = id
        tile.instance.editor.addEventListener('change', () => {
          storage.setItem(tile.id, tile.instance.editor.value)
          app.dispatchEvent(new CustomEvent('change', { detail: state.focus }))
        })
        editors.set(id, tile.instance)
        return tile
      } else {
        return new ScriptTile(this, pos, length, instance)
      }
    } else {
      const tile = new ScriptTile(
        this,
        pos,
        length,
        // middle click makes a clone, otherwise a mirror
        mouse.which === 2
          ? state.brush?.instance.editor.value
          : state.brush?.instance
      )
      if (!editors.has(tile.id)) {
        tile.instance.editor.addEventListener('change', () => {
          storage.setItem(tile.id, tile.instance.editor.value)
          app.dispatchEvent(new CustomEvent('change', { detail: state.focus }))
        })
        editors.set(tile.id, tile.instance)
        storage.setItem(tile.id, tile.instance.editor.value)
      }
      return tile
    }
  })
  const mouse = app.mouse = Mouse(app)

  const fixEvent = e => {
    if (state.focus && 'offsetX' in e) {
      e.realOffsetX = (e.offsetX - state.focus.offset.x) * state.focus.scale
      e.realOffsetY = (e.offsetY - state.focus.offset.y) * state.focus.scale
    }
    return e
  }

  const updateCursorMode = className => {
    if (className) {
      grid.canvas.className = className
      return
    }
    if (state.grabbed) {
      grid.canvas.className = 'cursor-grabbing'
      return
    }
    if (grid.hasSquare(mouse.square)) {
      const tile = grid.getTile(mouse.square)
      if (state.focus !== tile) {
        if (
          mouse.square.x === tile.pos.x + tile.length - 1 &&
          grid.zoom - (mouse.pos.x - mouse.square.x) * grid.zoom < 15) {
          grid.canvas.className = 'cursor-col-resize'
        } else if (
          (mouse.pos.y - mouse.square.y) * grid.zoom < 15 &&
          (mouse.square.x === tile.pos.x ? mouse.pos.x - mouse.square.x > .3 : true)) {
          grid.canvas.className = 'cursor-grab'
        } else {
          grid.canvas.className = ''
        }
      } else {
        grid.canvas.className = 'cursor-text'
      }
    } else {
      const { left, top, right, bottom } = grid.playbackRange
      const ry = Math.round(mouse.pos.y)
      const rx = Math.round(mouse.pos.x)
      if ((rx === left && ry === top) || (rx === right + 1 && ry === bottom + 1)) {
        grid.canvas.className = 'cursor-nwse-resize'
        return
      }
      if ((rx === right + 1 && ry === top) || (rx === left && ry === bottom + 1)) {
        grid.canvas.className = 'cursor-nesw-resize'
        return
      }
      if (rx === left || rx === right + 1) {
        grid.canvas.className = 'cursor-col-resize'
        return
      }
      if (ry === top || ry === bottom + 1) {
        grid.canvas.className = 'cursor-row-resize'
        return
      }
      grid.canvas.className = ''
    }
  }

  const maybeRemoveTile = pos => {
    const tile = grid.getTile(pos)
    if (state.focus && state.focus !== tile) {
      state.focus.blur()
      state.focus = null
    }
    // if there is a square, save it in brush
    // and remove it
    if (tile) {
      state.brush = grid.removeTile(pos)
    } else {
      // if there isn't a square, clear brush
      state.brush = null
    }
  }

  const handleMouseWheel = (e, noUpdate = false) => {
    if (state.focus && !state.keys.Control) return
    e.preventDefault()

    if (!state.zoomStart) state.zoomStart = Date.now()

    clearTimeout(state.zoomTimeout)
    state.zoomTimeout = setTimeout(() => { state.zoomStart = null }, 300)

    if (!noUpdate) {
      mouse.update(mouse.parseEvent(e))
    }

    grid.setScale(grid.scale - (
      noUpdate
        ? mouse.prev.d - mouse.px.d
        : mouse.px.d
    ))

    grid.setShift({
      x: Math.max(
        -mouse.square.x,
        mouse.px.x / grid.zoom - (
          mouse.pos.x - (mouse.pos.x - (mouse.square.x + .75)) *.12)
        ),
      y: Math.max(
        -mouse.square.y,
        mouse.px.y / grid.zoom - (
          mouse.pos.y - (mouse.pos.y - (mouse.square.y + .75)) *.12))
    })

    if (noUpdate) return

    grid.draw()
  }

  const handleMouseMove = e => {
    if (state.grabbed) {
      e.preventDefault()
      mouse.update(mouse.parseEvent(e))

      const [offset, tile] = state.grabbed
      const pos = {
        x: mouse.square.x - offset,
        y: mouse.square.y
      }
      if (!grid.hasSquare(pos, tile.length, tile)) {
        grid.moveTile(tile, pos)
      }
      return
    }
    if (state.resizing) {
      e.preventDefault()
      mouse.update(mouse.parseEvent(e))
      const newLength = mouse.square.x - state.resizing.pos.x + Math.round(mouse.pos.x - mouse.square.x)
      if (!grid.hasSquare(state.resizing.pos, newLength, state.resizing)) {
        state.brush = grid.setTileLength(state.resizing, newLength)
      }
      return
    }
    if (state.rerange) {
      mouse.update(mouse.parseEvent(e))
      Object.assign(grid.playbackRange, state.rerange(mouse.pos))
      grid.draw()
      return
    }
    if (mouse.down === 1) {
      const { x, y, d } = mouse.parseEvent(e)

      clearTimeout(state.drawingTimeout)

      // if we are drawing, maybe draw a square
      if (state.drawing) {
        e.preventDefault()

        mouse.update({ x, y, d })
        if (!grid.hasSquare(mouse.square, state.brush?.length)) {
          state.brush = grid.addTile(mouse.square, state.brush?.length)
        }
        return
      }

      // when an editor is focused, delegate event to it
      if (state.focus === grid.getTile(mouse.square)) {
        return state.focus.instance.editor.readMouseMoveEvent(fixEvent(e))
      }

      // if we have a distance, then this is a pinch zoom
      // TODO: overloading mousewheel event is hacky
      if (d) {
        e.preventDefault()
        mouse.update({ d })
        handleMouseWheel(e, true)
      } else {
        // not enough pixels distance to drag yet
        if (state.dragTimer && Math.abs(x - mouse.px.x) < 6 && Math.abs(y - mouse.px.y) < 6) return
      }

      // we are dragging
      state.dragTimer = 0

      const dx = mouse.px.x - x
      const dy = mouse.px.y - y
      // if diffs are too large then it's probably a pinch error, so discard
      if (Math.abs(dx) < 150 && Math.abs(dy) < 150) {
        state.didMove = true
        grid.setShift({
          x: grid.shift.x - (mouse.px.x - x) / grid.zoom,
          y: grid.shift.y - (mouse.px.y - y) / grid.zoom
        })
      }

      mouse.update({ x, y, d })

      grid.draw()
    } else if (mouse.down === 3) {
      if (!state.focus) {
        e.preventDefault()
        mouse.update(mouse.parseEvent(e))
        maybeRemoveTile(mouse.square)
      }
    } else if (!mouse.down) {
      mouse.update(mouse.parseEvent(e))
      updateCursorMode()
    }
  }

  const handleMouseDown = e => {
    if (state.background) return

    mouse.update(mouse.parseEvent(e))
    mouse.down = mouse.which

    e.preventDefault()

    if (mouse.which === 1) {
      state.dragTimer = performance.now()
      // mouse down on active square
      if (grid.hasSquare(mouse.square)) {
        const tile = grid.getTile(mouse.square)
        state.brush = tile
        updateCursorMode()
        if (grid.canvas.className === 'cursor-grab') {
          state.grabbed = [mouse.square.x - tile.pos.x, tile]
          updateCursorMode()
          return
        }
        if (grid.canvas.className === 'cursor-col-resize') {
          state.resizing = tile
          return
        }
        // mouse down on focused squard, delegate event to it
        if (state.focus === tile) {
          return state.focus.instance.editor.readMouseDownEvent(fixEvent(e))
        }
        // TODO: do something?
      } else {
        if (grid.canvas.className.includes('resize')) {
          const { left, top, right, bottom } = grid.playbackRange
          const rx = Math.round(mouse.pos.x)
          const ry = Math.round(mouse.pos.y)
          if (rx === left && ry === top) {
            state.rerange = pos => ({ left: Math.round(pos.x), top: Math.round(pos.y) })
          } else if (rx === right + 1 && ry === top) {
            state.rerange = pos => ({ right: Math.round(pos.x - 1), top: Math.round(pos.y) })
          } else if (rx === left && ry === bottom + 1) {
            state.rerange = pos => ({ left: Math.round(pos.x), bottom: Math.round(pos.y - 1) })
          } else if (rx === right + 1 && ry === bottom + 1) {
            state.rerange = pos => ({ right: Math.round(pos.x - 1), bottom: Math.round(pos.y - 1) })
          } else if (rx === left) {
            state.rerange = pos => ({ left: Math.round(pos.x) })
          } else if (rx === right + 1) {
            state.rerange = pos => ({ right: Math.round(pos.x - 1) })
          } else if (ry === top) {
            state.rerange = pos => ({ top: Math.round(pos.y) })
          } else if (ry === bottom + 1) {
            state.rerange = pos => ({ bottom: Math.round(pos.y - 1) })
          }
          return
        }
        // start drawing on long press
        state.drawingTimeout = setTimeout(() => {
          state.drawing = true
          if (!grid.hasSquare(mouse.square, state.brush?.length)) {
            state.brush = grid.addTile(mouse.square, state.brush?.length)
          }
        }, 500)
      }
    } else if (mouse.which === 3) {
      if (!state.focus) {
        maybeRemoveTile(mouse.square)
      }
    }
  }

  const handleMouseUp = e => {
    mouse.down = 0

    clearTimeout(state.drawingTimeout)
    if (state.drawing) {
      state.drawing = false
      e.preventDefault()
      return
    }

    if (state.grabbed) {
      state.grabbed = null
      e.preventDefault()
      updateCursorMode()
      return
    }

    if (state.resizing) {
      app.dispatchEvent(new CustomEvent('save', { detail: state.resizing }))
      state.resizing = null
      e.preventDefault()
      updateCursorMode()
      return
    }

    if (state.rerange) {
      state.rerange = null
      e.preventDefault()
      updateCursorMode()
      return
    }

    if (mouse.which === 1) { // left click
      if (performance.now() - state.dragTimer < 200 || state.focus) {
        if (grid.hasSquare(mouse.square)) {
          const tile = grid.getTile(mouse.square)
          state.brush = tile
          if (state.focus === tile) {
            state.focus.instance.editor.readMouseUpEvent(fixEvent(e))
          } else if (!state.didMove) {
            if (state.focus) {
              state.focus.blur()
            }
            state.focus = tile
            state.focus.focus()
            state.focus.instance.editor.readMouseDownEvent(fixEvent(e))
            state.focus.instance.editor.readMouseUpEvent(fixEvent(e))
          }
        } else if (state.focus && !state.didMove) {
          state.focus.blur()
          state.focus = null
        } else if (!state.didMove) {
          if (!grid.hasSquare(mouse.square, state.brush?.length)) {
            state.brush = grid.addTile(mouse.square, state.brush?.length)
          }
        }
      }
    } else if (mouse.which === 2) {
      e.preventDefault()
      const tile = grid.getTile(mouse.square)
      // make clone
      if (tile) { // if shift is pressed, replace with clone and focus
        state.brush = grid.removeTile(mouse.square)
        if (state.focus) state.focus.blur()
        state.focus = grid.addTile(mouse.square, state.brush?.length)
        state.focus.focus()
        // TODO: copy also caret/scroll position
      }
    }

    updateCursorMode()

    state.didMove = false
  }

  const handleMouseOver = e => {
    if (state.focus) {
      return state.focus.instance.editor.readMouseOverEvent(fixEvent(e))
    }
  }

  const handleMouseOut = e => {
    if (state.focus) {
      return state.focus.instance.editor.readMouseOverEvent(fixEvent(e))
    }
  }

  const handleKeyDown = e => {
    const { keys } = state
    keys[e.key] = true

    if (state.focus) {
      updateCursorMode('cursor-none')
    }

    if (keys.Tab) {
      if (!state.focus) {
        e.preventDefault()
        e.stopPropagation()
        grid.updatePlaybackRange()
        grid.draw()
        return
      }
    }

    if (keys.Control) {
      if (keys.l) {
        e.preventDefault()
        e.stopPropagation()
        app.dispatchEvent(new CustomEvent('live'))
      }
      if (keys.s) {
        e.preventDefault()
        e.stopPropagation()
        if (state.focus) {
          app.dispatchEvent(new CustomEvent('save', { detail: state.focus }))
        } else {
          const fullState = JSON.stringify({
            gridState: JSON.stringify(grid),
            gridTiles: JSON.stringify([...grid.tiles]),
            ...Object.fromEntries([...editors].map(([id, instance]) => [id, instance.editor.value]))
          }, null, 2)
          app.dispatchEvent(new CustomEvent('export', { detail: fullState }))
          keys.Control = false
          keys.s = false
        }
      }
      if (keys.o) {
        e.preventDefault()
        e.stopPropagation()
        app.dispatchEvent(new CustomEvent('import'))
        keys.Control = false
        keys.o = false
      }
    }
    if (!state.focus || keys.Control) {
      if (keys[' ']) {
        e.preventDefault()
        e.stopPropagation()
        app.dispatchEvent(new CustomEvent('play'))
      }
      if (keys.Enter) {
        e.preventDefault()
        e.stopPropagation()
        app.dispatchEvent(new CustomEvent('pause'))
      }
    }
    if (keys.Escape) {
      if (state.focus) {
        e.preventDefault()
        state.focus.blur()
        state.focus = null
        updateCursorMode()
      }
    }
    if (keys.Alt) {
      if (state.focus) {
        // TODO: if focused element is out of view,
        // move screen and put it into view
        // i.e generic solution: never let focused elements out of view
        // or never move out of current focus
        const { x, y } = state.focus.pos
        let focus
        if (keys.a)      focus = grid.getTile({ x: x-1, y }) // left
        else if (keys.d) focus = grid.getTile({ x: x+1, y }) // right
        else if (keys.w) focus = grid.getTile({ x, y: y-1 }) // up
        else if (keys.s) focus = grid.getTile({ x, y: y+1 }) // down
        if (focus) {
          e.preventDefault()
          state.focus.blur()
          state.focus = focus
          state.focus.focus()
        }
      }
    }
  }

  const handleKeyUp = e => {
    const { keys } = state
    keys[e.key] = false
  }

  const handleWindowResize = () => {
    grid.resize()
    grid.draw()
  }

  const handleContextMenu = e => {
    e.preventDefault()
    if (state.focus) {
      state.focus.blur()
      state.focus = null
    }
  }

  // the two events below prevent clicks to be handled when clicking into
  // an out of focus window to bring it to focus, and therefore prevent
  // unwanted paints
  const handleWindowBlur = e => {
    state.keys = {}
    state.background = true
  }

  const handleWindowFocus = e => {
    state.keys = {}
    setTimeout(() => state.background = false, 300)
  }

  window.addEventListener('blur', handleWindowBlur, { passive: false })
  window.addEventListener('focus', handleWindowFocus, { passive: false })
  window.addEventListener('resize', handleWindowResize, { passive: false })

  window.addEventListener('wheel', handleMouseWheel, { passive: false })
  window.addEventListener('mousedown', handleMouseDown, { passive: false })
  window.addEventListener('mouseup', handleMouseUp, { passive: false })
  window.addEventListener('mouseover', handleMouseOver, { passive: false })
  window.addEventListener('mouseout', handleMouseOut, { passive: false })
  window.addEventListener('mousemove', handleMouseMove, { passive: false })
  window.addEventListener('touchmove', handleMouseMove, { passive: false })
  window.addEventListener('touchstart', handleMouseDown, { passive: false })
  window.addEventListener('contextmenu', handleContextMenu, { passive: false })

  window.addEventListener('keydown', handleKeyDown, { passive: false })
  window.addEventListener('keyup', handleKeyUp, { passive: false })

  app.highlightColumn = col => {
    state.litColumn = col
    grid.draw()
  }

  app.destroy = () => {
    window.removeEventListener('blur', handleWindowBlur)
    window.removeEventListener('focus', handleWindowFocus)
    window.removeEventListener('resize', handleWindowResize)

    window.removeEventListener('wheel', handleMouseWheel)
    window.removeEventListener('mousedown', handleMouseDown)
    window.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('mouseover', handleMouseOver)
    window.removeEventListener('mouseout', handleMouseOut)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('touchmove', handleMouseMove)
    window.removeEventListener('touchstart', handleMouseDown)
    window.removeEventListener('contextmenu', handleContextMenu)

    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
    el.removeChild(grid.canvas)
  }

  grid.load()
  grid.saveState()
  grid.saveTiles()
  grid.draw()
  el.appendChild(grid.canvas)

  // currently we initialize in sync, but eventually it will be async
  // so we emit the load event asynchronously for the listeners to
  // have time to initialize
  setTimeout(() => {
    app.dispatchEvent(new CustomEvent('load'))
  })

  return app
}
