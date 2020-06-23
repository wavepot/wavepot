export default url => {
  return new Promise(resolve => {
    self.onfetch[url] = resolve
    self.postMessage({ fetch: url })
  })
}
