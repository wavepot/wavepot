export default filename => {
  return await new Promise((resolve, reject) => {
    const worker = new Worker(import.meta.url, { type: 'module' })
    worker.onmessage = ({ data }) => resolve(new Map(data))
    worker.onerror = reject
    worker.postMessage(filename)
  })
}

onmessage = ({ data: filename }) => {
  const module = await import(filename)
  const methods = Object.entries(module)
    .map(([key, value]) => {
      if (typeof value !== 'function') return

      return {
        name: key,
        type: value.constructor.name,
        code: value.toString()
      }
    })
    .filter(Boolean)
  postMessage(methods)
}
