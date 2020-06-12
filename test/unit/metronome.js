import Clock from '../../js/clock.js'
import Metronome from '../../js/metronome.js'

describe("new Metronome({ audioContext, clock })", function () {
  this.timeout(10000)
  this.bail(true)

  const audioContext = new AudioContext()

  // const fixtureBpm = [2000, 1000, 150, 140, 130, 120, 110, 100]
  const fixtureBpm = [2000, 100]

  for (const bpm of fixtureBpm) {
    let count = 2, bars = 2
    while (count--) {
      it(`should currectly run for ${bars} bars for bpm=${bpm}`, done => {

        let eventCount = 0

        let time
        const clock = new Clock(audioContext).setBpm(bpm).reset()
        const metronome = new Metronome({ audioContext, clock })

        let first
        const listener = () => {
          eventCount++

          if (!first) {
            first = metronome.bar
            time = performance.now()
          }

          if (metronome.bar - first === bars) {
            metronome.stop()
            metronome.removeEventListener('bar', listener)
            const duration = (performance.now() - time) / 1000
            // we adjust for gc delaying events
            expect(eventCount).to.equal(bars + 1)
            expect(duration).to.be.closeTo(clock.t.bar * bars, clock.t.beat * 0.8)
            done()
          }
        }
        metronome.addEventListener('bar', listener)

        metronome.start()
      })
    }
  }
})
