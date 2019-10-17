import background from "./background.svg"
import { Ios, Setup } from ".."

export const inputs: Ios = {
  in1: { x: 5, y: 40 },
  in2: { x: 5, y: 208 }
}

export const outputs: Ios = {
  out1a: { x: 5, y: 93 },
  out1b: { x: 5, y: 129 },
  out1c: { x: 5, y: 165 },
  out2a: { x: 5, y: 261 },
  out2b: { x: 5, y: 297 },
  out2c: { x: 5, y: 333 }
}

const setup: Setup = ({ inputs, outputs }) => {
  inputs.in1.connect(outputs.out1a)
  inputs.in1.connect(outputs.out1b)
  inputs.in1.connect(outputs.out1c)
  inputs.in2.connect(outputs.out2a)
  inputs.in2.connect(outputs.out2b)
  inputs.in2.connect(outputs.out2c)
}

export default { background, inputs, outputs, setup }
