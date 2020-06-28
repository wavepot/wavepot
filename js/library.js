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

  views.proj = views.favs = items =>
    items
      .map(item => ({
        el: document.createElement('div'),
        name: item,
        code: storage.getItem(item)
      }))
      .map(item => ({
        title: readFilenameFromCode(item.code) || item.name,
        ...item
      }))
      .sort((a, b) => a.title > b.title ? 1 : a.title < b.title ? -1 : 0)

  views.hist = items =>
    items
      .map(item => ({
        el: document.createElement('div'),
        name: item,
        title: item.split('_')[0],
        date: item.split('_')[1]
      }))
      .sort((b, a) => a.date > b.date ? 1 : a.date < b.date ? -1 : 0)

  const createList = (name, items = []) => {
    const list = document.createElement('div')
    list.className = 'list'

    views[name]?.(items).forEach(item => {
      item.el.textContent = item.title
      list.appendChild(item.el)
    })

    return list
  }

  const setList = lib.setList = (name, items) => {
    lib.list[name] = createList(name, items)
    if (name === menuActive) draw()
  }

  const draw = lib.draw = () => {
    lib.el.innerHTML = ''
    lib.el.appendChild(createMenu())
    lib.el.appendChild(lib.list[menuActive])
    lib.el.querySelector('.menu .active')?.classList.remove('active')
    lib.el.querySelector(`.${menuActive}`).classList.add('active')
  }

  lib.list = { proj: createList(), hist: createList(), favs: createList() }

  lib.el.addEventListener('mousedown', e => {
    e.stopPropagation()
  })

  lib.el.addEventListener('wheel', e => {
    e.stopPropagation()
  }, { passive: true })

  el.appendChild(lib.el)

  return lib
}
