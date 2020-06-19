import Clock from '../../js/clock.js'

const secs = n => new Promise(resolve => setTimeout(resolve, n * 1000))

const fixtures = {
  hz: [96000, 11025, 48000, 44100, 22050],
  bpm: [179, 150, 149, 148, 145, 144, 142, 141, 140, 139, 138, 136, 135, 130, 128, 129, 126, 100, 200, 300, 400, 500, 666, 1, 2, 3, 4, 5, 10]
  // bpm: [179, 149, 139, 128, 120, 100, 1000]
}

const p = 0.003

describe("new Clock(audioContext) times + lengths", function () {
  this.bail(true)

  for (const hz of fixtures.hz) {
    let audio
    it("should create audio", () => {
      audio = new AudioContext({ sampleRate: hz })
    })
    for (const bpm of fixtures.bpm) {
    // NOTE: fine grained iteration for development
    // for (let bpm = 1000; bpm > 1; bpm -= .1) {
    //   bpm = parseFloat(bpm.toFixed(1))
      it(`compute correct "times" for hz=${hz} bpm=${bpm}`, () => {
        const clock = new Clock().connect(audio.destination).setBpm(bpm)
        const { t, n, s, bpm: _bpm } = clock
        expect(t.beat).to.be.closeTo(60 / _bpm, p)
        expect(t.bar).to.be.closeTo(60 / _bpm * 4, p)
        expect(t.phrase).to.be.closeTo(60 / _bpm * 16, p)
      })

      it(`compute correct "lengths" for hz=${hz} bpm=${bpm}`, () => {
        const clock = new Clock().connect(audio.destination).setBpm(bpm)
        const { t, n, s } = clock
        expect(n.rate).to.equal(hz)
        expect(n.beat).to.be.closeTo(t.beat*hz, p)
        expect(n.beat/n.rate).to.equal(t.beat)
        expect(n.bar).to.be.closeTo(t.bar*hz, p)
        expect(n.bar).to.equal(n.beat*4)
        expect(n.bar/n.rate).to.equal(t.bar)
        expect(n.phrase).to.be.closeTo(t.phrase*hz, p)
        expect(n.phrase).to.equal(n.bar*4)
        expect(n.phrase/n.rate).to.equal(t.phrase)
      })

      it(`compute correct "sync" for hz=${hz} bpm=${bpm}`, async () => {
        const clock = new Clock().connect(audio.destination).setBpm(bpm).reset()
        clock.reset(-(clock.t.bar * 3) - 0.0001)
        const { current, t, n, s } = clock
        const { time, offset } = current
        expect(time).to.be.within(t.bar * 3 - p, t.phrase + p)
        expect(s.beat - offset).to.be.within(t.bar * 3 - p, t.bar * 3 + t.beat * 3 + p)
        expect(s.bar - offset).to.be.closeTo(t.bar * 4, p)
        expect(s.phrase - offset).to.be.closeTo(t.phrase, p)
      })

      it(`compute correct "current" for hz=${hz} bpm=${bpm}`, () => {
        const clock = new Clock().connect(audio.destination).setBpm(bpm).reset()
        clock.reset(-(clock.t.phrase * 3 + clock.t.beat * 5) - 0.0001)
        const { currentTime, c, t, n, s } = clock
        expect(c.time).to.be.closeTo(currentTime, p)
        expect(c.beat).to.equal(3 * 4 * 4 + 6)
        expect(c.bar).to.equal(3 * 4 + 2)
        expect(c.phrase).to.equal(4)
      })

      it(`compute correct "position" for hz=${hz} bpm=${bpm}`, () => {
        const clock = new Clock().connect(audio.destination).setBpm(bpm).reset()
        clock.reset(-(clock.t.phrase * 3 + clock.t.beat * 5) - 0.0001)
        const { current, p, t, n, s } = clock
        expect(p.beat).to.equal(6)
        expect(p.bar).to.equal(2)
        expect(p.phrase).to.equal(0)
      })
    }
    it("should close audio", async () => audio.close())
  }
})

describe("Clock.start()", function () {
  this.timeout(10000)
  this.bail(true)

  let audio
  it("should create audio", () => {
    audio = new AudioContext({ sampleRate: 44100 })
  })

  // const fixtureBpm = [2000, 1000, 150, 140, 130, 120, 110, 100]
  const fixtureBpm = [2000, 100]

  for (const bpm of fixtureBpm) {
    let count = 2, bars = 2
    while (count--) {
      it(`should currectly run for ${bars} bars for bpm=${bpm}`, done => {

        let eventCount = 0

        let time
        const clock = new Clock().connect(audio.destination).setBpm(bpm).reset()

        let first
        const listener = () => {
          eventCount++

          if (!first) {
            first = clock.bar
            time = performance.now()
          }

          if (clock.bar - first === bars) {
            clock.stop()
            audio.destination.removeEventListener('bar', listener)
            const duration = (performance.now() - time) / 1000
            // we adjust for gc delaying events
            expect(eventCount).to.equal(bars + 1)
            expect(duration).to.be.closeTo(clock.t.bar * bars, clock.t.beat * 0.8)
            done()
          }
        }
        audio.destination.addEventListener('bar', listener)

        clock.start()
      })
    }
  }

  it("should close audio", async () => audio.close())
})
