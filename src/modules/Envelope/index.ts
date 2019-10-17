import Tone from "tone"
import * as R from "ramda"
import background from "./background.svg"
import { Ios, Loop, Setup, Dispose } from ".."

const inputs: Ios = {
  gate: { x: 5, y: 272 },
  retrig: { x: 36, y: 272 }
}

const outputs: Ios = {
  out: { range: "audio", x: 36, y: 323 },
  inv: { range: "audio", x: 5, y: 323 }
}

const controls: Ios = {
  attack: { x: 12, y: 37 },
  decay: { x: 12, y: 96 },
  sustain: { x: 12, y: 154 },
  release: { x: 12, y: 213 }
}

const setup: Setup = ({ inputs, outputs, controls }) => {
  const tones = {
    envelope: new Tone.Envelope(),
    gateAnalyser: new Tone.Analyser("waveform", 64),
    retrigAnalyser: new Tone.Analyser("waveform", 64),
    inverter: new Tone.WaveShaper((x: number) => 1 - x)
  }

  tones.envelope.attack = controls.attack.value || 0.01
  tones.envelope.decay = controls.decay.value || 0.01
  tones.envelope.sustain = controls.sustain.value
  tones.envelope.release = controls.release.value || 0.01

  inputs.gate.connect(tones.gateAnalyser)
  inputs.retrig.connect(tones.retrigAnalyser)

  tones.envelope.connect(outputs.out)
  tones.envelope.chain(tones.inverter, outputs.inv)

  const dispose: Dispose = () => Object.values(tones).forEach(t => t.dispose())

  const gateFlip = (gate: any, values: any) => {
    if (!gate && R.any(R.flip(R.gt)(0.8), values)) return true
    if (gate && R.any(R.flip(R.lt)(0.2), values)) return false
    return gate
  }

  const loop: Loop = (props, values) => {
    const { gate: previousGate, retrig: previousRetrig } = props
    Object.keys(values).forEach(key => {
      const multiplier = key === "sustain" ? 1 : 10
      tones.envelope[key] = values[key] * values[key] * multiplier || 0.01
    })

    const gateValues = tones.gateAnalyser.getValue()
    const gate = gateFlip(previousGate, gateValues)

    const retrigValues = tones.retrigAnalyser.getValue()
    const retrig = gateFlip(previousRetrig, retrigValues)

    if ((gate && !previousGate) || (retrig && gate && !previousRetrig))
      tones.envelope.triggerAttack()

    if (!gate && previousGate) tones.envelope.triggerRelease()

    return { gate, retrig }
  }

  return { dispose, loop }
}

export default { inputs, outputs, controls, setup, background }
