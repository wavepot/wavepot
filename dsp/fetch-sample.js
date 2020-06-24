export default url => {
  return new Promise(resolve => {
    self.worker.callbacks[url] = resolve
    self.postMessage({ type: 'fetchsample', url })
  })
}
