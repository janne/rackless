import Tone from "tone"
import background from "./background.svg"

const inputs = {
  addX: { x: 5, y: 44 },
  addY: { x: 5, y: 92 },
  mulX: { x: 5, y: 215 },
  mulY: { x: 5, y: 263 }
}
const outputs = {
  add: { x: 5, y: 143 },
  mul: { x: 5, y: 314 }
}

const setup = ({ inputs, outputs }) => {
  const tones = {
    add: new Tone.Add(),
    mul: new Tone.Multiply()
  }

  inputs.addX.connect(tones.add, 0, 0)
  inputs.addY.connect(tones.add, 0, 1)
  tones.add.connect(outputs.add)

  inputs.mulX.connect(tones.mul, 0, 0)
  inputs.mulY.connect(tones.mul, 0, 1)
  tones.mul.connect(outputs.mul)

  return { dispose: () => Object.values(tones).forEach(t => t.dispose()) }
}

export default { background, inputs, outputs, setup }
