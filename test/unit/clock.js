import Clock from '../../js/clock.js'

const secs = n => new Promise(resolve => setTimeout(resolve, n * 1000))

const fixtures = {
  hz: [96000, 11025, 48000, 44100, 22050],
  bpm: [179, 150, 149, 148, 145, 144, 142, 141, 140, 139, 138, 136, 135, 130, 128, 129, 126, 100, 200, 300, 400, 500, 666, 1, 2, 3, 4, 5, 10]
  // bpm: [179, 149, 139, 128, 120, 100, 1000]
}

const p = 0.002

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
        const clock = new Clock(audio).setBpm(bpm)
        const { t, n, s, bpm: _bpm } = clock
        expect(t.beat).to.be.closeTo(60 / _bpm, p)
        expect(t.bar).to.be.closeTo(60 / _bpm * 4, p)
        expect(t.phrase).to.be.closeTo(60 / _bpm * 16, p)
      })

      it(`compute correct "lengths" for hz=${hz} bpm=${bpm}`, () => {
        const clock = new Clock(audio).setBpm(bpm)
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
        const clock = new Clock(audio).setBpm(bpm).reset()
        clock.reset(-(clock.t.bar * 3) - 0.0001)
        const { current, t, n, s } = clock
        const { time, offset } = current
        expect(time).to.be.within(t.bar * 3 - p, t.phrase + p)
        expect(s.beat - offset).to.be.within(t.bar * 3 - p, t.bar * 3 + t.beat * 3 + p)
        expect(s.bar - offset).to.be.closeTo(t.bar * 4, p)
        expect(s.phrase - offset).to.be.closeTo(t.phrase, p)
      })

      it(`compute correct "current" for hz=${hz} bpm=${bpm}`, () => {
        const clock = new Clock(audio).setBpm(bpm).reset()
        clock.reset(-(clock.t.phrase * 3 + clock.t.beat * 5) - 0.0001)
        const { currentTime, c, t, n, s } = clock
        expect(c.time).to.be.closeTo(currentTime, p)
        expect(c.beat).to.equal(3 * 4 * 4 + 5)
        expect(c.bar).to.equal(3 * 4 + 1)
        expect(c.phrase).to.equal(3)
      })

      it(`compute correct "note" for hz=${hz} bpm=${bpm}`, () => {
        const clock = new Clock(audio).setBpm(bpm).reset()
        clock.reset(-(clock.t.phrase * 3 + clock.t.beat * 5) - 0.0001)
        const { current, p, t, n, s } = clock
        expect(p.beat).to.equal(5)
        expect(p.bar).to.equal(1)
        expect(p.phrase).to.equal(3)
      })
    }
    it("should close audio", async () => audio.close())
  }
})
