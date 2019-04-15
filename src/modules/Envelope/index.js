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
    gateAnalyser: new Tone.Analyser("waveform", 32),
    retrigAnalyser: new Tone.Analyser("waveform", 32),
    inverter: new Tone.WaveShaper(x => 1 - x)
  }

  tones.envelope.attack = controls.attack.value || 0.01
  tones.envelope.decay = controls.decay.value || 0.01
  tones.envelope.sustain = controls.sustain.value
  tones.envelope.release = controls.release.value || 0.01

  inputs.gate.connect(tones.gateAnalyser)
  inputs.retrig.connect(tones.retrigAnalyser)

  tones.envelope.connect(outputs.out)
  tones.envelope.chain(tones.inverter, outputs.inv)

  const dispose = () => Object.values(tones).forEach(t => t.dispose())

  const gateFlip = (gate, value) => {
    if (!gate && value > 0.8) return true
    if (gate && value < 0.2) return false
    return gate
  }

  const loop = (props, values) => {
    const { gate: previousGate, retrig: previousRetrig } = props
    Object.keys(values).forEach(
      key => (tones.envelope[key] = values[key] || 0.01)
    )

    const gateValue = tones.gateAnalyser.getValue()[0]
    const gate = gateFlip(previousGate, gateValue)

    const retrigValue = tones.retrigAnalyser.getValue()[0]
    const retrig = gateFlip(previousRetrig, retrigValue)

    if ((gate && !previousGate) || (retrig && gate && !previousRetrig))
      tones.envelope.triggerAttack()

    if (!gate && previousGate) tones.envelope.triggerRelease()

    return { gate, retrig }
  }

  return [dispose, loop]
}

export default { inputs, outputs, controls, setup, background }
