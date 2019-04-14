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
  attack: { x: 12, y: 37 },
  decay: { x: 12, y: 96 },
  sustain: { x: 12, y: 154 },
  release: { x: 12, y: 213 }
}

const setup = ({ inputs, outputs, controls }) => {
  const tones = {
    envelope: new Tone.Envelope(),
    analyser: new Tone.Analyser("waveform", 32)
  }

  tones.envelope.attack = controls.attack.value || 0.01
  tones.envelope.decay = controls.decay.value || 0.01
  tones.envelope.sustain = controls.sustain.value
  tones.envelope.release = controls.release.value || 0.01

  inputs.gate.connect(tones.analyser)

  tones.envelope.connect(outputs.out)

  const dispose = () => Object.values(tones).forEach(t => t.dispose())

  const loop = (gateHigh = false) => {
    const values = tones.analyser.getValue()

    if (!gateHigh && values[0] > 0.8) {
      tones.envelope.triggerAttack()
      return true
    }

    if (gateHigh && values[0] < 0.2) {
      tones.envelope.triggerRelease()
      return false
    }

    return gateHigh
  }

  return [dispose, loop]
}

export default { inputs, outputs, controls, setup, background }
