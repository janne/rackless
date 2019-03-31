import Tone from "tone"
import BaseInstrument from "../BaseInstrument"
export { default as background } from "./background.svg"

export const pots = [
  { x: 19.33, y: 13.66, name: "gain", range: "normal" },
  { x: 19.33, y: 35.33, name: "level1", range: "normal" },
  { x: 35.33, y: 35.33, name: "pan1", range: "audio" },
  { x: 19.33, y: 59, name: "level2", range: "normal" },
  { x: 35.33, y: 58.66, name: "pan2", range: "audio" },
  { x: 19.3, y: 94, name: "level3", range: "normal" }
]

export const input = [
  { x: 4.5, y: 38, name: "i1", socketId: 0, range: "audio" },
  { x: 4.5, y: 61.33, name: "i2", socketId: 1, range: "audio" },
  { x: 4.5, y: 86.33, name: "i3l", socketId: 2, range: "audio" },
  { x: 4.5, y: 104.66, name: "i3r", socketId: 3, range: "audio" },
  { x: 37.5, y: 80.5, name: "pancv", socketId: 4, range: "audio" }
]

export class Instrument extends BaseInstrument {
  constructor(pots, inputs) {
    super(pots, inputs)

    this.masterGain = this.makeTone(Tone.Gain)
    this.gain.connect(this.masterGain.gain)
    this.masterGain.connect(Tone.Master)

    this.gain1 = this.makeTone(Tone.Gain)
    this.level1.connect(this.gain1.gain)
    this.panner1 = this.makeTone(Tone.Panner)
    this.pan1.connect(this.panner1.pan)
    this.input[0].chain(this.gain1, this.panner1, this.masterGain)

    this.gain2 = this.makeTone(Tone.Gain)
    this.level2.connect(this.gain2.gain)
    this.panner2 = this.makeTone(Tone.Panner)
    this.pan2adder = this.makeTone(Tone.Add)
    this.pan2.connect(this.pan2adder)
    this.pancv.connect(this.pan2adder)
    this.pan2adder.connect(this.panner2.pan)
    this.i2.chain(this.gain2, this.panner2, this.masterGain)
    this.gain3l = this.makeTone(Tone.Gain)
    this.level3.connect(this.gain3l.gain)
    this.panner3l = this.makeTone(Tone.Panner, -1)
    this.i3l.chain(this.gain3l, this.panner3l, this.masterGain)
    this.gain3r = this.makeTone(Tone.Gain)
    this.level3.connect(this.gain3r.gain)
    this.panner3r = this.makeTone(Tone.Panner, 1)
    this.i3r.chain(this.gain3r, this.panner3r, this.masterGain)
  }
}
