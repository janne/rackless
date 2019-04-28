import Tone from "tone"
import background from "./background.svg"

const controls = {
  attack: { x: 12, y: 42 },
  decay: { x: 12, y: 135 },
  type: { x: 15, y: 245, range: ["exp", "lin"] }
}

const inputs = {
  in: { x: 5, y: 312 },
  attack: { x: 20, y: 83 },
  decay: { x: 20, y: 176 }
}

const outputs = {
  out: { x: 36, y: 313 }
}

const setup = ({ inputs, outputs }) => {
  const tones = {
    analyser: new Tone.Analyser("waveform", 64),
    signal: new Tone.Signal()
  }

  inputs.in.connect(tones.analyser)
  tones.signal.connect(outputs.out)

  const dispose = () => Object.values(tones).forEach(t => t.dispose())

  const loop = ({ sig }, values) => {
    const newSig = tones.analyser.getValue()[0]
    if (newSig != sig) {
      tones.signal.linearRampTo(newSig, 1)
    }
    return { sig: newSig }
  }

  return { dispose, loop }
}

export default { background, controls, inputs, outputs, setup }
