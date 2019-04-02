import Tone from "tone"

export { default as background } from "./background.svg"

export const inputs = [
  { name: "cutoff", x: 3.33, y: 58.33, range: "normal" },
  { name: "quality", x: 3.33, y: 77.33, range: "normal" },
  { name: "in", x: 3.33, y: 98.66, range: "audio" }
]

export const outputs = [{ name: "out", x: 19, y: 98.66, range: "audio" }]

export const controls = [
  { name: "cutoff", x: 16, y: 55.33, range: "normal" },
  { name: "quality", x: 16, y: 74.33, range: "normal" }
]

export const setup = ({ inputs, outputs, controls }) => {
  const tones = { filter: new Tone.Filter() }
  inputs.in.chain(tones.filter, outputs.out)

  return () => {
    Object.values(tones).forEach(t => t.dispose())
  }
}
