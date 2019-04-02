import Tone from "tone"
export { default as background } from "./background.svg"

export const controls = [
  { name: "gain", x: 19.33, y: 13.66, range: "normal" },
  { name: "level1", x: 19.33, y: 35.33, range: "normal" },
  { name: "pan1", x: 35.33, y: 35.33, range: "audio" },
  { name: "level2", x: 19.33, y: 59, range: "normal" },
  { name: "pan2", x: 35.33, y: 58.66, range: "audio" },
  { name: "level3", x: 19.3, y: 94, range: "normal" }
]

export const inputs = [
  { name: "i1", x: 4.5, y: 38, range: "audio" },
  { name: "i2", x: 4.5, y: 61.33, range: "audio" },
  { name: "i3l", x: 4.5, y: 86.33, range: "audio" },
  { name: "i3r", x: 4.5, y: 104.66, range: "audio" },
  { name: "pancv", x: 37.5, y: 80.5, range: "audio" }
]

export const setup = ({ controls, inputs }) => {
  const tones = {
    masterGain: new Tone.Gain(),
    gain1: new Tone.Gain(),
    panner1: new Tone.Panner(),
    gain2: new Tone.Gain(),
    panner2: new Tone.Panner(),
    gain3l: new Tone.Gain(),
    panner3l: new Tone.Panner(-1),
    gain3r: new Tone.Gain(),
    panner3r: new Tone.Panner(1),
    pan2adder: new Tone.Add()
  }

  controls.gain.connect(tones.masterGain.gain)
  tones.masterGain.connect(Tone.Master)
  controls.level1.connect(tones.gain1.gain)
  controls.pan1.connect(tones.panner1.pan)
  inputs.i1.chain(tones.gain1, tones.panner1, tones.masterGain)
  controls.level2.connect(tones.gain2.gain)
  controls.pan2.connect(tones.pan2adder)
  inputs.pancv.connect(tones.pan2adder)
  tones.pan2adder.connect(tones.panner2.pan)
  inputs.i2.chain(tones.gain2, tones.panner2, tones.masterGain)
  controls.level3.connect(tones.gain3l.gain)
  inputs.i3l.chain(tones.gain3l, tones.panner3l, tones.masterGain)
  controls.level3.connect(tones.gain3r.gain)
  inputs.i3r.chain(tones.gain3r, tones.panner3r, tones.masterGain)

  return () => {
    Object.values(tones).forEach(t => t.dispose())
  }
}
