import Module from "../Module"
import Tone from "tone"
import AudioToFrequency from "./AudioToFrequency"

export default class extends Module {
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
