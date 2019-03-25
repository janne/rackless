import Tone from "tone"
import AudioToFrequency from "./AudioToFrequency"

export default class extends Tone.Instrument {
  constructor(opts) {
    super(opts)

    this.createInsOuts(4, 4)

    const options = Tone.defaultArg(opts, Tone.Oscillator.defaults)
    this.freq = new Tone.Signal(options.freq, Tone.Type.AudioRange)
    this.freqHz = new Tone.Signal(options.freq, Tone.Type.Frequency)
    this.freq.chain(new AudioToFrequency(440), this.freqHz)
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
      const osc = (this.output[idx] = new Tone.Oscillator(0, type).start())
      this._oscillators.push(osc)

      // Fine
      const freqWithFine = new Tone.Multiply(1)
      this.freqHz.connect(freqWithFine, 0, 0)
      this.fine.connect(freqWithFine, 0, 1)

      // Voct
      const freqWithVoct = new Tone.Multiply(1)
      freqWithFine.connect(freqWithVoct, 0, 0)
      this.voct.connect(freqWithVoct, 0, 1)

      freqWithVoct.connect(osc.frequency)
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
