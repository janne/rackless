import Tone from "tone"
import background from "./background.svg"

const controls = {
  level1: { x: 47, y: 37 },
  level2: { x: 47, y: 180 }
}

const inputs = {
  cv1: { x: 10, y: 46 },
  cv2: { x: 10, y: 189 },
  input1: { x: 10, y: 102, range: "audio" },
  input2: { x: 10, y: 245, range: "audio" }
}

const outputs = {
  output1: { x: 56, y: 102, range: "audio" },
  output2: { x: 56, y: 245, range: "audio" },
  mix: { x: 56, y: 315, range: "audio" }
}

const setup = ({ inputs, outputs, controls }) => {
  const tones = {}

  tones.gain1 = new Tone.Gain()
  tones.add1 = new Tone.Add()
  controls.level1.connect(tones.add1, 0, 0)
  inputs.cv1.connect(tones.add1, 0, 1)
  tones.add1.connect(tones.gain1.gain)
  inputs.input1.chain(tones.gain1)
  tones.gain1.connect(outputs.output1)
  tones.gain1.connect(outputs.mix)

  tones.gain2 = new Tone.Gain()
  tones.add2 = new Tone.Add()
  controls.level2.connect(tones.add2, 0, 0)
  inputs.cv2.connect(tones.add2, 0, 1)
  tones.add2.connect(tones.gain2.gain)
  inputs.input2.chain(tones.gain2)
  tones.gain2.connect(outputs.output2)
  tones.gain2.connect(outputs.mix)

  return { dispose: () => Object.values(tones).forEach(t => t.dispose()) }
}

export default { inputs, outputs, controls, setup, background }
