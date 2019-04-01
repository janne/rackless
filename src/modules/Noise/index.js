import Tone from "tone"

export { default as background } from "./background.svg"

export const outputs = [
  { name: "white", x: 1.33, y: 21.33, range: "audio" },
  { name: "brown", x: 1.33, y: 54, range: "audio" },
  { name: "pink", x: 1.33, y: 86.33, range: "audio" }
]

export const setup = ({ make, outputs }) => {
  make(Tone.Noise, "pink")
    .start()
    .connect(outputs.pink)
  make(Tone.Noise, "brown")
    .start()
    .connect(outputs.brown)
  make(Tone.Noise, "white")
    .start()
    .connect(outputs.white)
}
