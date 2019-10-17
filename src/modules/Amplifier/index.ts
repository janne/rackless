import Tone from "tone"
import background from "./background.svg"
import { Ios, AudioNode, Setup } from ".."

const controls: Ios = {
  level1: { x: 5, y: 37 },
  bias1: { x: 50, y: 37 },
  level2: { x: 5, y: 187 },
  bias2: { x: 50, y: 187 }
}

const inputs: Ios = {
  cv1: { x: 35, y: 100 },
  cv2: { x: 35, y: 250 },
  in1: { x: 5, y: 100, range: "audio" },
  in2: { x: 5, y: 250, range: "audio" }
}

const outputs: Ios = {
  out1: { x: 66, y: 100, range: "audio" },
  out2: { x: 66, y: 250, range: "audio" },
  mix: { x: 66, y: 315, range: "audio" }
}

const setup: Setup = ({ inputs, outputs, controls }) => {
  const tones: { [k: string]: AudioNode } = {
    gain1: new Tone.Gain(),
    add1: new Tone.Add(),
    level1: new Tone.Gain(),
    double1: new Tone.Multiply(2),
    gain2: new Tone.Gain(),
    add2: new Tone.Add(),
    level2: new Tone.Gain(),
    double2: new Tone.Multiply(2)
  }

  controls.bias1.connect(tones.add1, 0, 0)
  inputs.cv1.connect(tones.level1)
  controls.level1.chain(tones.double1, tones.level1.gain)
  tones.level1.connect(tones.add1, 0, 1)
  tones.add1.connect(tones.gain1.gain)
  inputs.in1.chain(tones.gain1)
  tones.gain1.connect(outputs.out1)
  tones.gain1.connect(outputs.mix)

  controls.bias2.connect(tones.add2, 0, 0)
  inputs.cv2.connect(tones.level2)
  controls.level2.chain(tones.double2, tones.level2.gain)
  tones.level2.connect(tones.add2, 0, 1)
  tones.add2.connect(tones.gain2.gain)
  inputs.in2.chain(tones.gain2)
  tones.gain2.connect(outputs.out2)
  tones.gain2.connect(outputs.mix)

  return { dispose: () => Object.values(tones).forEach(t => t.dispose()) }
}

export default { inputs, outputs, controls, setup, background }
