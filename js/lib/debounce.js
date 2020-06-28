export default (ms, fn, timeout) => (...args) => {
  clearTimeout(timeout)
  timeout = setTimeout(fn, ms, ...args)
}
