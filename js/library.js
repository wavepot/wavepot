import readFilenameFromCode from './lib/read-filename-from-code.js'

export default (app, el, storage) => {
  const lib = new EventTarget

  if (window.DEBUG) window.lib = lib

  lib.el = document.createElement('div')
  lib.el.className = 'lib'

  const menuItems = ['proj', 'curr', 'hist', 'favs']
  let menuActive = storage.getItem('menuActive') ?? 'proj'
  lib.items = {
    proj: [],
    curr: [],
    hist: [],
    favs: []
  }

  const projItems = [
    'new',
    'save as',
    'clone',
    'import',
    'export',
    'share',
    'persist',
    '-'
  ]

  const createMenu = (name, items) => {
    const menu = document.createElement('div')
    menu.className = 'menu ' + name

    items.forEach(name => {
      const el = document.createElement('div')
      el.className = name
      el.textContent = name
      el.onclick = e => {
        menuActive = name
        storage.setItem('menuActive', menuActive)
        draw()
      }
      menu.appendChild(el)
    })

    return menu
  }

  const views = {}

  views.proj = items =>
    items
      .map(item => ({
        el: document.createElement('div'),
        id: item,
        name: item,
        title: item
      }))
      .map(item => {
        if (item.title === '-') {
          item.el.className = 'ruler'
        } else {
          item.el.dataset.id = item.id
          item.el.textContent = item.title
        }
        return item
      })

  views.curr = items =>
    items
      .map(item => ({
        el: document.createElement('div'),
        id: item,
        name: item,
        code: storage.getItem(item)
      }))
      .map(item => ({
        ...item,
        title: readFilenameFromCode(item.code) || item.name
      }))
      .map(item => {
        item.el.dataset.id = item.id
        item.el.textContent = item.title
        item.el.title = item.code
        return item
      })
      .sort((a, b) => a.title > b.title ? 1 : a.title < b.title ? -1 : 0)

  const favs = (storage.getItem('favs')?.split(',') ?? []).filter(Boolean)

  views.hist = items =>
    items
      .map(item => ({
        el: document.createElement('div'),
        id: item,
        name: item.split('.')[0],
        title: item,
        version: item.split('.')[1],
        code: storage.getItem(item)
      }))
      .map(item => ({
        ...item,
        title: (readFilenameFromCode(item.code) || item.name) + ' ' + (item.version ?? 0)
      }))
      .map(item => {
        const addToFav = document.createElement('input')
        addToFav.type = 'checkbox'
        addToFav.checked = favs.includes(item.id)
        addToFav.onchange = e => {
          const index = favs.indexOf(item.id)
          if (e.target.checked) {
            if (index === -1) {
              favs.push(item.id)
              storage.setItem('favs', favs.join())
            }
          } else {
            if (index > -1) {
              favs.splice(index, 1)
              storage.setItem('favs', favs.join())
            }
          }
          if (menuActive !== 'favs') {
            lib.updateList('favs')
          } else {
            lib.updateList('hist')
          }
        }
        item.el.textContent = item.title
        item.el.title = item.code
        item.el.appendChild(addToFav)
        return item
      })

  views.favs = items => views.hist(items)
    .sort((a, b) => a.title > b.title ? 1 : a.title < b.title ? -1 : 0)

  const createList = (name, items = []) => {
    const list = document.createElement('div')
    list.className = 'list ' + name
    lib.items[name] = items
    views[name]?.(items).forEach(item => {
      list.appendChild(item.el)
    })

    return list
  }

  const setList = lib.setList = (name, items) => {
    lib.list[name] = createList(name, items)
    if (name === menuActive) draw()
  }

  const updateList = lib.updateList = name => {
    lib.setList(name, lib.items[name])
  }

  const draw = lib.draw = () => {
    lib.el.innerHTML = '<div class="menu">untitled</div>'
    // lib.el.appendChild(createMenu('port', ['open', 'save', 'new']))
    // lib.el.appendChild(createMenu('workspaces', spaceItems))
    // lib.el.appendChild(createList('workspaces', lib.spaces))
    lib.el.appendChild(createMenu('project', menuItems))
    lib.el.appendChild(lib.list[menuActive])
    lib.el.querySelector('.menu .active')?.classList.remove('active')
    lib.el.querySelector(`.${menuActive}`).classList.add('active')
  }

  lib.list = {
    proj: createList('proj', projItems),
    curr: createList(),
    hist: createList(),
    favs: createList('favs', favs)
  }

  lib.el.addEventListener('mousedown', e => {
    e.stopPropagation()
    const tile = app.sequencer.grid.tiles.find(([pos, tile]) => tile.id === e.target.dataset.id)?.[1]
    if (tile) {
      app.sequencer.grid.setShift({ x: -tile.pos.x, y: -tile.pos.y })
      app.sequencer.grid.setScale(7)
      app.sequencer.grid.draw()
      tile.focus()
    }
  })

  lib.el.addEventListener('wheel', e => {
    e.stopPropagation()
  }, { passive: true })

  el.appendChild(lib.el)

  return lib
}
