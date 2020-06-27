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

  const menuItems = ['view', 'hist', 'favs']
  const menuActive = 'favs'

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

    items.forEach(item => {
      item.el.textContent = readFilenameFromCode(item.code)
      list.appendChild(item.el)
    })

    return list
  }

  lib.el.appendChild(createMenu())
  lib.el.appendChild(createList(starred))
  lib.el.querySelector(`.${menuActive}`).classList.add('active')

  el.appendChild(lib.el)
}
