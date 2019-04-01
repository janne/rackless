import Tone from "tone"
import AudioToFrequency from "./AudioToFrequency"
export { default as background } from "./background.svg"

export const pots = [
  { x: 19.33, y: 24.66, name: "freq", range: "audio" },
  { x: 35.33, y: 24.66, name: "fine", range: "audio" },
  { x: 19, y: 53.33, name: "fmcv", range: "normal" },
  { x: 19, y: 79.33, name: "pwmcv", range: "normal" },
  { x: 35, y: 79.33, name: "pwidth", range: "audio" }
]

export const inputs = [
  { x: 4.33, y: 27.33, name: "voct", socketId: 0, range: "normal" },
  { x: 4.33, y: 56, name: "fm", socketId: 1, range: "audio" },
  { x: 4.33, y: 82, name: "pwm", socketId: 2, range: "normal" }
]

export const outputs = [
  { x: 4.33, y: 106.66, name: "sin", socketId: 0, range: "frequency" },
  { x: 15.66, y: 106.66, name: "tri", socketId: 1, range: "frequency" },
  { x: 27, y: 106.66, name: "saw", socketId: 2, range: "frequency" },
  { x: 38, y: 106.66, name: "sqr", socketId: 3, range: "frequency" }
]

export const setup = ({ make, pots, inputs, outputs }) => {
  const { Sine, Triangle, Sawtooth, Square } = Tone.Oscillator.Type
  const types = [Sine, Triangle, Sawtooth, Square]

  types.forEach((type, idx) => {
    const osc =
      type === Square
        ? make(Tone.PulseOscillator)
        : make(Tone.Oscillator, 0, type)

    // PWM
    if (type === Square) {
      const scaledPwm = make(Tone.Gain)
      inputs.pwm.connect(scaledPwm)
      pots.pwmcv.connect(scaledPwm.gain)
      const plusPwidth = make(Tone.Add)
      scaledPwm.connect(plusPwidth)
      pots.pwidth.connect(plusPwidth)
      plusPwidth.connect(osc.width)
    }

    // Fine
    const scaledFine = make(Tone.Multiply, 100)
    pots.fine.connect(scaledFine)
    scaledFine.connect(osc.detune)

    // Voct
    const plusVoct = make(Tone.Add)
    pots.freq.connect(plusVoct, 0, 0)
    inputs.voct.connect(plusVoct, 0, 1)

    // FM
    const scaledFm = make(Tone.Gain)
    inputs.fm.connect(scaledFm)
    pots.fmcv.connect(scaledFm.gain)
    const plusFm = make(Tone.Add)
    plusVoct.connect(plusFm, 0, 0)
    scaledFm.connect(plusFm, 0, 1)

    plusFm.chain(new AudioToFrequency(220), osc.frequency)

    const outputNames = ["sin", "tri", "saw", "sqr"]
    osc.start().connect(outputs[outputNames[idx]])
  })
}
