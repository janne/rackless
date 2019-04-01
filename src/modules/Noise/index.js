import Tone from "tone"

export { default as background } from "./background.svg"

export const outputs = [
  { x: 1.33, y: 21.33, name: "white", socketId: 0, range: "audio" },
  { x: 1.33, y: 54, name: "brown", socketId: 1, range: "audio" },
  { x: 1.33, y: 86.33, name: "pink", socketId: 2, range: "audio" }
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
