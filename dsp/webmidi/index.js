const buffer = new SharedArrayBuffer(128)
const CTRL_KEY_MAP = new Int8Array(buffer).fill(0)

const onMIDIMessage = channel => event => {
  console.log(`channel ${event.data[1]}: ${event.data[2]}`)
  if (channel != 0 && channel != event.data[1]) return
  // Mask off the lower nibble (MIDI channel, which we don't care about)
  console.log(event.data[0] & 0xf0)
  switch (event.data[0] & 0xf0) {
    case 0x90:
      if (event.data[2] != 0) {  // if velocity != 0, this is a note-on message
        CTRL_KEY_MAP[event.data[1]] = event.data[2]
        break;
      } else {
        return
      }
    case 0xB0:
      CTRL_KEY_MAP[event.data[1]] = event.data[2]
      break;
    // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
    case 0x80:
      // Do we want to get velocity 0? Not sure what key holding will give in
      // a MIDI controller, last value or 0? Commented because of Drum machine
      CTRL_KEY_MAP[event.data[1]] = 0
      break;
  }
}

// port: MIDI controller number (according to access.inputs list)
// channel: channel number / 0 (all channels)
export default async function MIDI(params = {}) {
  const access = await navigator.requestMIDIAccess()
  // Get lists of available MIDI controllers
  const inputs = access.inputs.values();
  // TODO maybe call InputMIDI and not use outputs from here?
  // const outputs = access.outputs.values();
  access.onstatechange = function (e) {
    // Print information about the (dis)connected MIDI controller
    // console.log(e.port.name, e.port.manufacturer, e.port.state)
    // How should we handle MIDI controller state changes?
  }
  const input = Array.from(inputs)[params.port || 0]
  input.onmidimessage = onMIDIMessage(params.channel || 0)
  return CTRL_KEY_MAP
}