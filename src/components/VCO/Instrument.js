import Tone from "tone"
import AudioToFrequency from "./AudioToFrequency"

export default class extends Tone.Instrument {
  constructor(opts) {
    super(opts)

    this.createInsOuts(4, 4)

    const options = Tone.defaultArg(opts, Tone.Oscillator.defaults)
    this.freq = new Tone.Signal(options.freq, Tone.Type.AudioRange)
    this.fine = new Tone.Signal(options.fine, Tone.Type.AudioRange)
    this.pwidth = new Tone.Signal(options.pwidth, Tone.Type.AudioRange)
    this.fmcv = new Tone.Signal(options.fmcv, Tone.Type.NormalRange)
    this.pwmcv = new Tone.Signal(options.pwmcv, Tone.Type.NormalRange)

    this.voct = this.input[0] = new Tone.Signal(0, Tone.Type.NormalRange)
    this.fm = this.input[1] = new Tone.Signal(0, Tone.Type.AudioRange)
    this.sync = this.input[2] = new Tone.Signal(0, Tone.Type.NormalRange)
    this.pwm = this.input[3] = new Tone.Signal(0, Tone.Type.NormalRange)

    this._oscillators = []

    const { Sine, Triangle, Sawtooth, Square } = Tone.Oscillator.Type
    const types = [Sine, Triangle, Sawtooth, Square]

    types.forEach((type, idx) => {
      const osc =
        type === Square
          ? new Tone.PulseOscillator()
          : new Tone.Oscillator(0, type)
      this._oscillators.push(osc)

      // Pulse width
      if (type === Square) {
        const scaledPwm = new Tone.Gain()
        this.pwm.connect(scaledPwm)
        this.pwmcv.connect(scaledPwm.gain)
        const plusPwidth = new Tone.Add()
        scaledPwm.connect(plusPwidth)
        this.pwidth.connect(plusPwidth)
        plusPwidth.connect(osc.width)
      }

      // Fine
      const scaledFine = new Tone.Multiply(1 / 12)
      this.fine.connect(scaledFine)
      const plusFine = new Tone.Add()
      this.freq.connect(plusFine, 0, 0)
      scaledFine.connect(plusFine, 0, 1)

      // Voct
      const plusVoct = new Tone.Add()
      plusFine.connect(plusVoct, 0, 0)
      this.voct.connect(plusVoct, 0, 1)

      // FM
      const scaledFm = new Tone.Gain()
      this.fm.connect(scaledFm)
      this.fmcv.connect(scaledFm.gain)
      const plusFm = new Tone.Add()
      plusVoct.connect(plusFm, 0, 0)
      scaledFm.connect(plusFm, 0, 1)

      plusFm.chain(new AudioToFrequency(220), osc.frequency)
      this.output[idx] = osc.start()
    })
  }

  dispose() {
    Tone.Instrument.prototype.dispose.call(this)
    this.freq.dispose()
    this.freqHz.dispose()
    this.fine.dispose()
    this.pwidth.dispose()
    this.fmcv.dispose()
    this.pwmcv.dispose()
    this.voct.dispose()
    this.fm.dispose()
    this.sync.dispose()
    this.pwm.dispose()
    this._oscillators.map(o => o.dispose())
  }
}
