import readFilenameFromCode from './lib/read-filename-from-code.js'

export default async (app, el, storage) => {
  const lib = new EventTarget

  if (window.DEBUG) window.lib = lib

  lib.el = document.createElement('div')
  lib.el.className = 'lib'

  const menuItems = ['proj', 'curr', 'hist', 'favs']
  let menuActive = (await storage.getItem('menuActive')) ?? 'proj'
  lib.items = {
    proj: [],
    curr: [],
    hist: [],
    favs: []
  }

  const projItems = [
    ['new', () => app.import({ gridState: '{}', gridTiles: '[]' })],
    // ['save as', () => {}],
    // ['clone', () => {}],
    ['import', () => app.importDialog()],
    ['export', () => app.export(app.sequencer.stringify())],
    // ['share'],
    // ['persist'],
    ['-'],
  ]

  const histItems = [
    ['erase history', () => {
      if (!confirm('Are you sure?\n\nIf you click OK, this will erase ALL history (except favs)\nand there is no way to undo!')) return
      app.clearHistory()
    }],
    ['-'],
  ]

  const createMenu = (name, items) => {
    const menu = document.createElement('div')
    menu.className = 'menu ' + name

    items.forEach(name => {
      const el = document.createElement('div')
      el.className = name
      el.textContent = name
      el.onclick = async e => {
        menuActive = name
        await storage.setItem('menuActive', menuActive)
        draw()
      }
      menu.appendChild(el)
    })

    return menu
  }

  const addToFav = item => {
    const div = document.createElement('input')
    div.type = 'checkbox'
    div.checked = favs.includes(item.id)
    div.onchange = async e => {
      const index = favs.indexOf(item.id)
      if (e.target.checked) {
        if (index === -1) {
          favs.push(item.id)
          await storage.setItem('favs', favs.join())
        }
      } else {
        if (index > -1) {
          favs.splice(index, 1)
          await storage.setItem('favs', favs.join())
        }
      }
      ;['favs','curr','hist'].forEach(m => menuActive !== m && lib.updateList(m))
    }
    return div
  }

  const views = {}

  views.proj = async items =>
    items
      .map(([item, fn]) => ({
        el: document.createElement('div'),
        id: item,
        fn,
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
        if (item.fn) {
          item.el.onclick = item.fn
        }
        return item
      })
      .concat(Object.keys(app.projects)
        .map(item => ({
          el: document.createElement('div'),
          id: item
        }))
        .map(item => {
          item.el.textContent = item.id
          item.el.onclick = e => {
            if (item.id === app.projectName) return
            app.import(JSON.parse(app.projects[item.id]), item.id, true)
          }
          return item
        })
        .sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0)
      )

  views.curr = async items =>
    (await Promise.all(items
      .map(async item => ({
        el: document.createElement('div'),
        id: item,
        name: item,
        code: await storage.getItem(item)
      }))))
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

  const favs = ((await storage.getItem('favs'))?.split(',') ?? []).filter(Boolean)

  views.hist = async (items, actions = histItems) =>
    actions
      .map(([item, fn]) => ({
        el: document.createElement('div'),
        id: item,
        fn,
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
        if (item.fn) {
          item.el.onclick = item.fn
        }
        return item
      })
      .concat((await Promise.all(items
        .map(async item => ({
          el: document.createElement('div'),
          id: item,
          name: item.split('.')[0],
          title: item,
          version: item.split('.')[1],
          code: await storage.getItem(item)
        }))))
        .map(item => ({
          ...item,
          title: (readFilenameFromCode(item.code) || item.name) + '.' + (item.version ?? item.id)
        }))
        .map(item => {
          item.el.textContent = item.title
          item.el.title = item.code
          item.el.appendChild(addToFav(item))
          return item
        }))

  views.favs = async items => (await views.hist(items, []))
    .sort((a, b) => a.title > b.title ? 1 : a.title < b.title ? -1 : 0)

  const createList = (name, items = []) => {
    const list = document.createElement('div')
    list.className = 'list ' + name
    lib.items[name] = items

    views[name](items).then(items => items.forEach(item => {
      list.appendChild(item.el)
    }))

    return list
  }

  const setList = lib.setList = (name, items) => {
    lib.list[name] = createList(name, items)
    if (name === menuActive) draw()
  }

  const updateList = lib.updateList = name => {
    lib.setList(name, lib.items[name])
  }

  const ProjectName = () => {
    const div = document.createElement('div')
    div.className = 'menu project-name'
    div.contentEditable = 'true'
    div.textContent = app.projectName
    div.onkeydown = e => {
      e.stopPropagation()
      if (e.which === 13) div.blur()
    }
    div.onblur = async () => {
      if (div.textContent === app.projectName) return
      div.textContent = await app.setProjectName(div.textContent, true)
    }
    div.oninput = e => {
      e.stopPropagation()
    }
    return div
  }

  const draw = lib.draw = () => {
    lib.el.innerHTML = ''
    lib.el.appendChild(ProjectName())
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
    curr: createList('curr', []),
    hist: createList('hist', []),
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
      app.sequencer.state.focus = tile
    }
  })

  lib.el.addEventListener('wheel', e => {
    e.stopPropagation()
  }, { passive: true })

  el.appendChild(lib.el)

  return lib
}
