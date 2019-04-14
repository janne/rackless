import Tone from "tone"
import background from "./background.svg"

const inputs = {
  gate: { x: 5, y: 272 },
  retrig: { x: 36, y: 272 }
}

const outputs = {
  out: { range: "audio", x: 36, y: 323 },
  inv: { range: "audio", x: 5, y: 323 }
}

const controls = {
  attack: { x: 12, y: 37, range: "time" },
  decay: { x: 12, y: 96, range: "time" },
  sustain: { x: 12, y: 213 },
  release: { x: 12, y: 154, range: "time" }
}

const setup = ({ inputs, outputs, controls }) => {
  const tones = {
    envelope: new Tone.Envelope(),
    analyser: new Tone.Analyser("waveform", 32)
  }

  tones.envelope.attack = controls.attack
  tones.envelope.decay = controls.decay
  tones.envelope.sustain = controls.sustain
  tones.envelope.release = controls.release

  inputs.gate.connect(tones.analyser)

  tones.envelope.connect(outputs.out)

  return () => Object.values(tones).forEach(t => t.dispose())
}

export default { inputs, outputs, controls, setup, background }
