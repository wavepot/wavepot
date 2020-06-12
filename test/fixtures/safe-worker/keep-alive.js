export default () => {
  onmessage = ({ data }) => postMessage({ received: data })
  postMessage({ ready: true })
}
