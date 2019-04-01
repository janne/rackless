import Tone from "tone"
import AudioToFrequency from "./AudioToFrequency"
export { default as background } from "./background.svg"

export const pots = [
  { name: "freq", x: 19.33, y: 24.66, range: "audio" },
  { name: "fine", x: 35.33, y: 24.66, range: "audio" },
  { name: "fmcv", x: 19, y: 53.33, range: "normal" },
  { name: "pwmcv", x: 19, y: 79.33, range: "normal" },
  { name: "pwidth", x: 35, y: 79.33, range: "audio" }
]

export const inputs = [
  { name: "voct", x: 4.33, y: 27.33, range: "normal" },
  { name: "fm", x: 4.33, y: 56, range: "audio" },
  { name: "pwm", x: 4.33, y: 82, range: "normal" }
]

export const outputs = [
  { name: "sin", x: 4.33, y: 106.66, range: "frequency" },
  { name: "tri", x: 15.66, y: 106.66, range: "frequency" },
  { name: "saw", x: 27, y: 106.66, range: "frequency" },
  { name: "sqr", x: 38, y: 106.66, range: "frequency" }
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
    const output = outputs[outputNames[idx]]
    output.start = () => osc.start()
    output.stop = () => osc.stop()
    osc.connect(output)
  })
}
