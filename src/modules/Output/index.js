import Tone from "tone"
import background from "./background.svg"

const controls = {
  gain: { x: 58, y: 41 },
  level1: { x: 58, y: 106 },
  pan1: { x: 106, y: 106, range: "audio" },
  level2: { x: 58, y: 177 },
  pan2: { x: 106, y: 176, range: "audio" },
  level3: { x: 58, y: 282 }
}

const inputs = {
  input1: { x: 13, y: 114, range: "audio" },
  input2: { x: 13, y: 184, range: "audio" },
  input3left: { x: 13, y: 259, range: "audio" },
  input3right: { x: 13, y: 314, range: "audio" },
  pancv: { x: 114, y: 243, range: "audio" }
}

const setup = ({ controls, inputs }) => {
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
  inputs.input1.chain(tones.gain1, tones.panner1, tones.masterGain)
  controls.level2.connect(tones.gain2.gain)
  controls.pan2.connect(tones.pan2adder)
  inputs.pancv.connect(tones.pan2adder)
  tones.pan2adder.connect(tones.panner2.pan)
  inputs.input2.chain(tones.gain2, tones.panner2, tones.masterGain)
  controls.level3.connect(tones.gain3l.gain)
  inputs.input3left.chain(tones.gain3l, tones.panner3l, tones.masterGain)
  controls.level3.connect(tones.gain3r.gain)
  inputs.input3right.chain(tones.gain3r, tones.panner3r, tones.masterGain)

  return { dispose: () => Object.values(tones).forEach(t => t.dispose()) }
}

export default { inputs, controls, setup, background }
