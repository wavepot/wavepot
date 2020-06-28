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

  lib.list = {}

  const menuItems = ['proj', 'hist', 'favs']
  const menuActive = 'proj'

  const starred = ['313yo', '3s0sa', '1xuc8', '1bhjr']

  const createMenu = () => {
    const menu = document.createElement('div')
    menu.className = 'menu'

    menuItems.forEach(name => {
      const el = document.createElement('div')
      el.className = name
      el.textContent = name
      menu.appendChild(el)
    })

    return menu
  }

  const createList = items => {
    const list = document.createElement('div')
    list.className = 'list'

    items = items
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

    items.forEach(item => {
      item.el.textContent = item.title
      list.appendChild(item.el)
    })

    return list
  }

  const setProject = lib.setProject = items => {
    lib.list.project = createList(items)
  }

  const draw = lib.draw = () => {
    lib.el.innerHTML = ''
    lib.el.appendChild(createMenu())
    lib.el.appendChild(lib.list.project)
    lib.el.querySelector(`.${menuActive}`).classList.add('active')
  }

  el.appendChild(lib.el)

  return lib
}
