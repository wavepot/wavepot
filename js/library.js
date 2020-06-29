const readFilenameFromCode = code => {
  code = code.trim()
  if (code[0] === '`') {
    const nextBackquoteIndex = code.indexOf('`', 1)
    const filename = code
      .slice(1, nextBackquoteIndex)
      .toLowerCase()
      .replace(/[^a-z0-9-_./]{1,}/gm, '-')
    return filename
  }
}

export default (el, storage) => {
  const lib = new EventTarget

  if (window.DEBUG) window.lib = lib

  lib.el = document.createElement('div')
  lib.el.className = 'lib'

  const menuItems = ['proj', 'hist', 'favs']
  let menuActive = storage.getItem('menuActive') ?? 'proj'
  lib.items = { proj: [], hist: [], favs: [] }

  const starred = ['313yo', '3s0sa', '1xuc8', '1bhjr']

  const createMenu = () => {
    const menu = document.createElement('div')
    menu.className = 'menu'

    menuItems.forEach(name => {
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
        code: storage.getItem(item)
      }))
      .map(item => ({
        ...item,
        title: readFilenameFromCode(item.code) || item.name
      }))
      .map(item => {
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
    list.className = 'list'
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
    lib.el.innerHTML = ''
    lib.el.appendChild(createMenu())
    lib.el.appendChild(lib.list[menuActive])
    lib.el.querySelector('.menu .active')?.classList.remove('active')
    lib.el.querySelector(`.${menuActive}`).classList.add('active')
  }

  lib.list = { proj: createList(), hist: createList(), favs: createList('favs', favs) }

  lib.el.addEventListener('mousedown', e => {
    e.stopPropagation()
  })

  lib.el.addEventListener('wheel', e => {
    e.stopPropagation()
  }, { passive: true })

  el.appendChild(lib.el)

  return lib
}
