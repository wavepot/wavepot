export default fn => {
  const gestures = [
    'keypress',
    'touchend',
    'mouseup',
  ]
  let fired = false
  const listener = () => {
    if (fired) return
    fired = true
    gestures.forEach(name => window.removeEventListener(name, listener))
    fn()
  }
  gestures.forEach(name => window.addEventListener(name, listener, { once: true }))
}
