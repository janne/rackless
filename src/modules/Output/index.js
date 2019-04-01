import Tone from "tone"
export { default as background } from "./background.svg"

export const pots = [
  { x: 19.33, y: 13.66, name: "gain", range: "normal" },
  { x: 19.33, y: 35.33, name: "level1", range: "normal" },
  { x: 35.33, y: 35.33, name: "pan1", range: "audio" },
  { x: 19.33, y: 59, name: "level2", range: "normal" },
  { x: 35.33, y: 58.66, name: "pan2", range: "audio" },
  { x: 19.3, y: 94, name: "level3", range: "normal" }
]

export const inputs = [
  { x: 4.5, y: 38, name: "i1", socketId: 0, range: "audio" },
  { x: 4.5, y: 61.33, name: "i2", socketId: 1, range: "audio" },
  { x: 4.5, y: 86.33, name: "i3l", socketId: 2, range: "audio" },
  { x: 4.5, y: 104.66, name: "i3r", socketId: 3, range: "audio" },
  { x: 37.5, y: 80.5, name: "pancv", socketId: 4, range: "audio" }
]

export const setup = ({ make, pots, inputs }) => {
  const masterGain = make(Tone.Gain)
  pots.gain.connect(masterGain.gain)
  masterGain.connect(Tone.Master)

  const gain1 = make(Tone.Gain)
  pots.level1.connect(gain1.gain)
  const panner1 = make(Tone.Panner)
  pots.pan1.connect(panner1.pan)
  inputs.i1.chain(gain1, panner1, masterGain)

  const gain2 = make(Tone.Gain)
  pots.level2.connect(gain2.gain)
  const panner2 = make(Tone.Panner)
  const pan2adder = make(Tone.Add)
  pots.pan2.connect(pan2adder)
  inputs.pancv.connect(pan2adder)
  pan2adder.connect(panner2.pan)
  inputs.i2.chain(gain2, panner2, masterGain)
  const gain3l = make(Tone.Gain)
  pots.level3.connect(gain3l.gain)
  const panner3l = make(Tone.Panner, -1)
  inputs.i3l.chain(gain3l, panner3l, masterGain)
  const gain3r = make(Tone.Gain)
  pots.level3.connect(gain3r.gain)
  const panner3r = make(Tone.Panner, 1)
  inputs.i3r.chain(gain3r, panner3r, masterGain)
}
