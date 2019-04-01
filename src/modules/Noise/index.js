import Tone from "tone"
import BaseInstrument from "../BaseInstrument"

export { default as background } from "./background.svg"

export const pots = []
export const input = []
export const output = [
  { x: 1.33, y: 21.33, name: "white", socketId: 0, range: "audio" },
  { x: 1.33, y: 54, name: "brown", socketId: 1, range: "audio" },
  { x: 1.33, y: 86.33, name: "pink", socketId: 2, range: "audio" }
]

export class Instrument extends BaseInstrument {
  constructor(pots, inputs, outputs) {
    super(pots, inputs, outputs)
    const pink = this.makeTone(Tone.Noise, "pink")
    pink.start().connect(this.pink)
    const brown = this.makeTone(Tone.Noise, "brown")
    brown.start().connect(this.brown)
    const white = this.makeTone(Tone.Noise, "white")
    white.start().connect(this.white)
  }
}
