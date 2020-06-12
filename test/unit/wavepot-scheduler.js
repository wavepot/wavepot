// import * as dspFixtures from '../fixtures/dsp.js'
// import Wavepot from '../../js/wavepot.js'

// const scheduler = Wavepot.prototype.scheduler

/*

Algorithm:

- User On Play Code:
  - If Code in History
    - Play/Replace CurrentBuffer with HistoryBuffer at SaveSync
  - Worker.Setup()

- Worker On Setup
  - IsNew=true
  - Save Current Buffer To History of Old Code
  - Terminate Old Worker
  - If SaveSync=PhraseStart (bar=0) [Ctrl+s]
    - N_Start = NextPhraseN_After:
        N_Of: CurrentTime +
          Max: AverageMinimumBarRenderTime, TrackBarRenderTime
  - If SaveSync=Bar (bar=?) [Super+s]
    - N_Start = NextBarN_After:
        N_Of: CurrentTime +
          Max: AverageMinimumBarRenderTime, TrackBarRenderTime
  - If SaveSync=ASAP [Alt+s]
    - N_Start = NextPhraseN(bar=0)
  - Loop = StartN:N_Start % BufferSize  EndN:(Loop.Start+N_Bar)
  - BufferView = Loop.StartN,Loop.EndN
  - Worker.Render(BufferView, N_Start, Sync:SaveSync)

- Worker On Render
  - If IsNew
    ?? handle if index arrived is < current global index
    - If SaveSync=PhraseStart
      - Schedule Buffer Start: N_Start = NextPhraseN
      - If Running Schedule Old Buffer Stop: N_Start = NextPhraseN
    - If SaveSync=BarStart
    - If SaveSync=ASAP
    - Set CurrentBuffer.Loop = Loop
    - Worker.Render(NextBufferView, N_Start+N_bar)
  - If NotNew
    - If Loop.End.N - CurrentBuffer.Loop.Start.N !== 0
      - Adjust Loop: Set CurrentBuffer.Loop.End=Loop.End
      - Worker.Render(NextBufferView, N_Start+N_bar)
    - Else
      - Set Metronome.onBar: Worker.Render(NextBufferView)

*/

// describe("scheduler()", () => {
//   const postMessageCalls = []

//   const mockTrack = {
//     code: dspFixtures.sine.toString(),
//     active: false,
//     phraseIndex: 0,
//     worker: { postMessage: (...args) => postMessageCalls.push(args) },
//     context: {
//       channels: 1
//     }
//   }

//   const mockSong = {
//     tracks: new Map([['default', mockTrack]]),
//   }


//   const mockContext = {
//     scheduler,
//     songs: new Map([['dsp.js', mockSong]]),
//     times: { sync: 100, bar: 15, phrase: 15 * 4 },
//     history: new Map,
//     audioPool: () => ({ get: () => ({
//       start (startTime) { this.startTime = startTime },
//       stop (stopTime) { this.stopTime = stopTime },
//       source: {},
//       getChannels: () => {}
//     }) }),
//   }

//   let historySetCalls = 0
//   const historySet = mockContext.history.set
//   mockContext.history.set = (key, value) => {
//     historySetCalls++
//     historySet.call(mockContext.history, key, value)
//   }

//   it("when active=false should not process", () => {
//     const processed = scheduler.call(mockContext)
//     expect(processed).to.equal(0)
//   })

//   it("when active=true, no bars, asks for render once", () => {
//     mockTrack.active = true
//     mockTrack.phrase = []
//     const processed = scheduler.call(mockContext)
//     expect(processed).to.equal(1)
//     expect(postMessageCalls.length).to.equal(1)
//     expect(postMessageCalls[0]).to.deep.equal([{ type: 'render', context: mockTrack.context }])
//     expect(mockTrack.sync).to.equal(undefined)
//     expect(mockTrack.pending).to.equal(true)
//   })

//   it("no bars yet, should remain the same", () => {
//     const processed = scheduler.call(mockContext)
//     expect(processed).to.equal(1)
//     expect(postMessageCalls.length).to.equal(1)
//     expect(mockTrack.sync).to.equal(undefined)
//   })

//   it("receive 1 bar, asks for render again", () => {
//     mockTrack.pending = false
//     mockTrack.phrase.push(mockTrack.bar)
//     const processed = scheduler.call(mockContext)
//     expect(processed).to.equal(1)
//     expect(postMessageCalls.length).to.equal(2)
//     expect(postMessageCalls[1]).to.deep.equal([{ type: 'render', context: mockTrack.context }])
//     expect(mockTrack.sync).to.equal(100)
//     expect(mockTrack.phrase[0].startTime).to.equal(mockTrack.sync)
//     expect(mockTrack.phrase[0].stopTime).to.equal(undefined)
//     expect(historySetCalls).to.equal(1)
//     expect(mockContext.history.size).to.equal(1)
//     expect(mockContext.history.get(mockTrack.code)).to.equal(mockTrack.phrase)
//   })

//   it("still 1 bar, should remain same", () => {
//     const processed = scheduler.call(mockContext)
//     expect(processed).to.equal(1)
//     expect(postMessageCalls.length).to.equal(2)
//     expect(postMessageCalls[1]).to.deep.equal([{ type: 'render', context: mockTrack.context }])
//     expect(mockTrack.sync).to.equal(100)
//     expect(mockTrack.phrase[0].startTime).to.equal(mockTrack.sync)
//     expect(mockTrack.phrase[0].stopTime).to.equal(undefined)
//     expect(historySetCalls).to.equal(1)
//     expect(mockContext.history.size).to.equal(1)
//     expect(mockContext.history.get(mockTrack.code)).to.equal(mockTrack.phrase)
//   })

//   it("receive 2nd bar, asks for render again", () => {
//     mockTrack.pending = false
//     mockTrack.phrase.push(mockTrack.bar)
//     const processed = scheduler.call(mockContext)
//     expect(processed).to.equal(1)
//     expect(postMessageCalls.length).to.equal(3)
//     expect(postMessageCalls[2]).to.deep.equal([{ type: 'render', context: mockTrack.context }])
//     expect(mockTrack.sync).to.equal(100)
//     expect(mockTrack.phrase[0].startTime).to.equal(mockTrack.sync)
//     expect(mockTrack.phrase[0].stopTime).to.equal(mockTrack.sync + mockContext.times.bar)
//     expect(mockTrack.phrase[1].startTime).to.equal(mockTrack.sync + mockContext.times.bar)
//     expect(mockTrack.phrase[1].stopTime).to.equal(undefined)
//     expect(historySetCalls).to.equal(1)
//     expect(mockContext.history.size).to.equal(1)
//     expect(mockContext.history.get(mockTrack.code)).to.equal(mockTrack.phrase)
//     expect(mockTrack.phraseIndex).to.equal(0)
//   })

//   it("bar 1 ended, call schedule implicitly, still pending", () => {
//     mockTrack.phrase[0].source.onended()
//     expect(mockTrack.phraseIndex).to.equal(1)
//     expect(postMessageCalls.length).to.equal(3)
//     expect(mockTrack.sync).to.equal(100)
//     expect(mockTrack.phrase[0].startTime).to.equal(mockTrack.sync)
//     expect(mockTrack.phrase[0].stopTime).to.equal(mockTrack.sync + mockContext.times.bar)
//     expect(mockTrack.phrase[1].startTime).to.equal(mockTrack.sync + mockContext.times.bar)
//     expect(mockTrack.phrase[1].stopTime).to.equal(undefined)
//     expect(historySetCalls).to.equal(1)
//     expect(mockContext.history.size).to.equal(1)
//     expect(mockContext.history.get(mockTrack.code)).to.equal(mockTrack.phrase)
//   })

//   it("receive 3rd bar, asks for render again", () => {
//     mockTrack.pending = false
//     mockTrack.phrase.push(mockTrack.bar)
//     const processed = scheduler.call(mockContext)
//     expect(processed).to.equal(1)
//     expect(postMessageCalls.length).to.equal(4)
//     expect(postMessageCalls[3]).to.deep.equal([{ type: 'render', context: mockTrack.context }])
//     expect(mockTrack.sync).to.equal(100)
//     expect(mockTrack.phrase[0].startTime).to.equal(mockTrack.sync)
//     expect(mockTrack.phrase[0].stopTime).to.equal(mockTrack.sync + mockContext.times.bar)
//     expect(mockTrack.phrase[1].startTime).to.equal(mockTrack.sync + mockContext.times.bar)
//     expect(mockTrack.phrase[1].stopTime).to.equal(mockTrack.sync + mockContext.times.bar * 2)
//     expect(mockTrack.phrase[2].startTime).to.equal(mockTrack.sync + mockContext.times.bar * 2)
//     expect(mockTrack.phrase[2].stopTime).to.equal(undefined)
//     expect(historySetCalls).to.equal(1)
//     expect(mockContext.history.size).to.equal(1)
//     expect(mockContext.history.get(mockTrack.code)).to.equal(mockTrack.phrase)
//     expect(mockTrack.phraseIndex).to.equal(1)
//   })

//   it("receive 4th bar, saves phrase to history, asks for render again", () => {
//     mockTrack.pending = false
//     mockTrack.phrase.push(mockTrack.bar)
//     const processed = scheduler.call(mockContext)
//     expect(processed).to.equal(1)
//     expect(postMessageCalls.length).to.equal(5)
//     expect(postMessageCalls[4]).to.deep.equal([{ type: 'render', context: mockTrack.context }])
//     expect(mockTrack.sync).to.equal(100)
//     expect(mockTrack.phrase.length).to.equal(4)
//     expect(mockTrack.phrase[0].startTime).to.equal(mockTrack.sync)
//     expect(mockTrack.phrase[0].stopTime).to.equal(mockTrack.sync + mockContext.times.bar)
//     expect(mockTrack.phrase[1].startTime).to.equal(mockTrack.sync + mockContext.times.bar)
//     expect(mockTrack.phrase[1].stopTime).to.equal(mockTrack.sync + mockContext.times.bar * 2)
//     expect(mockTrack.phrase[2].startTime).to.equal(mockTrack.sync + mockContext.times.bar * 2)
//     expect(mockTrack.phrase[2].stopTime).to.equal(mockTrack.sync + mockContext.times.bar * 3)
//     expect(mockTrack.phrase[3].startTime).to.equal(mockTrack.sync + mockContext.times.bar * 3)
//     expect(mockTrack.phrase[3].stopTime).to.equal(undefined)
//     expect(historySetCalls).to.equal(1)
//     expect(mockContext.history.size).to.equal(1)
//     expect(mockContext.history.get(mockTrack.code)).to.equal(mockTrack.phrase)
//     expect(mockTrack.phraseIndex).to.equal(1)
//   })

//   it("receive new 1 bar, should not ask for render", () => {
//     mockTrack.pending = false
//     mockTrack.phrase.push(mockTrack.bar)
//     const oldSync = mockTrack.sync
//     const processed = scheduler.call(mockContext)
//     expect(processed).to.equal(1)
//     expect(postMessageCalls.length).to.equal(5)
//     expect(postMessageCalls[4]).to.deep.equal([{ type: 'render', context: mockTrack.context }])
//     expect(mockTrack.sync).to.equal(160)
//     const historyPhrase = mockContext.history.get(mockTrack.code)
//     expect(historyPhrase.length).to.equal(4)
//     expect(historyPhrase[0].startTime).to.equal(oldSync)
//     expect(historyPhrase[0].stopTime).to.equal(oldSync + mockContext.times.bar)
//     expect(historyPhrase[1].startTime).to.equal(oldSync + mockContext.times.bar)
//     expect(historyPhrase[1].stopTime).to.equal(oldSync + mockContext.times.bar * 2)
//     expect(historyPhrase[2].startTime).to.equal(oldSync + mockContext.times.bar * 2)
//     expect(historyPhrase[2].stopTime).to.equal(oldSync + mockContext.times.bar * 3)
//     expect(historyPhrase[3].startTime).to.equal(oldSync + mockContext.times.bar * 3)
//     expect(historyPhrase[3].stopTime).to.equal(oldSync + mockContext.times.bar * 4)
//     expect(mockTrack.phrase[0].startTime).to.equal(mockTrack.sync)
//     expect(mockTrack.phrase[0].stopTime).to.equal(undefined)
//     expect(historySetCalls).to.equal(1)
//     expect(mockContext.history.size).to.equal(1)
//     expect(mockContext.history.get(mockTrack.code)).to.equal(mockTrack.phrase)
//   })
// })
