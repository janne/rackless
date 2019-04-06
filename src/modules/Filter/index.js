import Tone from "tone"

import background from "./background.svg"

const inputs = [
  { name: "cutoff", x: 3.33, y: 58.33, range: "frequency" },
  { name: "quality", x: 3.33, y: 77.33, range: "normal" },
  { name: "in", x: 3.33, y: 98.66, range: "frequency" }
]

const outputs = [{ name: "out", x: 19, y: 98.66, range: "frequency" }]

const controls = [
  { name: "cutoff", x: 16, y: 55.33, range: "frequency" },
  { name: "quality", x: 16, y: 74.33, range: "normal" }
]

const setup = ({ inputs, outputs, controls }) => {
  const tones = {
    filter: new Tone.Filter(),
    plusCutoff: new Tone.Add(),
    plusQuality: new Tone.Add(),
    audioToFrequency: new Tone.WaveShaper(x => 220 * Math.pow(2, x * 5)),
    multiply: new Tone.Multiply(20)
  }

  controls.cutoff.connect(tones.plusCutoff, 0, 0)
  inputs.cutoff.connect(tones.plusCutoff, 0, 1)
  tones.plusCutoff.chain(tones.audioToFrequency, tones.filter.frequency)

  controls.quality.connect(tones.plusQuality, 0, 0)
  inputs.quality.connect(tones.plusQuality, 0, 1)
  tones.plusQuality.chain(tones.multiply, tones.filter.Q)

  inputs.in.chain(tones.filter, outputs.out)

  return () => {
    Object.values(tones).forEach(t => t.dispose())
  }
}

export default { inputs, outputs, controls, setup, background }
