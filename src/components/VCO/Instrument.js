import Tone from "tone"
import AudioToFrequency from "./AudioToFrequency"

export default class extends Tone.Instrument {
  tones = []

  makeTone(Class, ...args) {
    const tone = new Class(...args)
    this.tones.push(tone)
    return tone
  }

  constructor(opts) {
    super(opts)

    this.createInsOuts(4, 4)

    const options = Tone.defaultArg(opts, Tone.Oscillator.defaults)
    this.freq = this.makeTone(Tone.Signal, options.freq, Tone.Type.AudioRange)
    this.fine = this.makeTone(Tone.Signal, options.fine, Tone.Type.AudioRange)
    this.pwidth = this.makeTone(
      Tone.Signal,
      options.pwidth,
      Tone.Type.AudioRange
    )
    this.fmcv = this.makeTone(Tone.Signal, options.fmcv, Tone.Type.NormalRange)
    this.pwmcv = this.makeTone(
      Tone.Signal,
      options.pwmcv,
      Tone.Type.NormalRange
    )

    this.voct = this.makeTone(Tone.Signal, 0, Tone.Type.NormalRange)
    this.input[0] = this.voct
    this.fm = this.makeTone(Tone.Signal, 0, Tone.Type.AudioRange)
    this.input[1] = this.fm
    this.pwm = this.makeTone(Tone.Signal, 0, Tone.Type.NormalRange)
    this.input[2] = this.pwm

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
      this.output[idx] = osc.start()
    })
  }

  dispose() {
    this.tones.forEach(t => t.dispose())
    super.dispose()
  }
}
