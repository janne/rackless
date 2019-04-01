import Tone from "tone"
import BaseInstrument from "../BaseInstrument"
import AudioToFrequency from "./AudioToFrequency"
export { default as background } from "./background.svg"

export const pots = [
  { x: 19.33, y: 24.66, name: "freq", range: "audio" },
  { x: 35.33, y: 24.66, name: "fine", range: "audio" },
  { x: 19, y: 53.33, name: "fmcv", range: "normal" },
  { x: 19, y: 79.33, name: "pwmcv", range: "normal" },
  { x: 35, y: 79.33, name: "pwidth", range: "audio" }
]

export const input = [
  { x: 4.33, y: 27.33, name: "voct", socketId: 0, range: "normal" },
  { x: 4.33, y: 56, name: "fm", socketId: 1, range: "audio" },
  { x: 4.33, y: 82, name: "pwm", socketId: 2, range: "normal" }
]

export const output = [
  { x: 4.33, y: 106.66, name: "sin", socketId: 0, range: "frequency" }, // sin
  { x: 15.66, y: 106.66, name: "tri", socketId: 1, range: "frequency" }, // tri
  { x: 27, y: 106.66, name: "saw", socketId: 2, range: "frequency" }, // saw
  { x: 38, y: 106.66, name: "sqr", socketId: 3, range: "frequency" } // sqr
]

export class Instrument extends BaseInstrument {
  constructor(pots, inputs, outputs) {
    super(pots, inputs, outputs)

    const { Sine, Triangle, Sawtooth, Square } = Tone.Oscillator.Type
    const types = [Sine, Triangle, Sawtooth, Square]

    types.forEach((type, idx) => {
      const osc =
        type === Square
          ? this.makeTone(Tone.PulseOscillator)
          : this.makeTone(Tone.Oscillator, 0, type)

      // PWM
      if (type === Square) {
        const scaledPwm = this.makeTone(Tone.Gain)
        this.pwm.connect(scaledPwm)
        this.pwmcv.connect(scaledPwm.gain)
        const plusPwidth = this.makeTone(Tone.Add)
        scaledPwm.connect(plusPwidth)
        this.pwidth.connect(plusPwidth)
        plusPwidth.connect(osc.width)
      }

      // Fine
      const scaledFine = this.makeTone(Tone.Multiply, 100)
      this.fine.connect(scaledFine)
      scaledFine.connect(osc.detune)

      // Voct
      const plusVoct = this.makeTone(Tone.Add)
      this.freq.connect(plusVoct, 0, 0)
      this.voct.connect(plusVoct, 0, 1)

      // FM
      const scaledFm = this.makeTone(Tone.Gain)
      this.fm.connect(scaledFm)
      this.fmcv.connect(scaledFm.gain)
      const plusFm = this.makeTone(Tone.Add)
      plusVoct.connect(plusFm, 0, 0)
      scaledFm.connect(plusFm, 0, 1)

      plusFm.chain(new AudioToFrequency(220), osc.frequency)

      osc.start().connect(this.output[idx])
    })
  }
}
