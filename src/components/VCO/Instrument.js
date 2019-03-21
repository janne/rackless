import Tone from "tone"

export default class extends Tone.Instrument {
  constructor(opts) {
    const options = Tone.defaultArg(opts, Tone.Oscillator.defaults)
    super(options)
    this.frequency = new Tone.Signal(options.frequency, Tone.Type.Frequency)
    this._oscillators = []
    this.output = ["sine", "triangle", "sawtooth", "square"].map(type => {
      const osc = new Tone.Oscillator(440, type)
      this._oscillators.push(osc)
      this.frequency.connect(osc.frequency)
      const out = new Tone.Volume(options.volume)
      osc.start().connect(out)
      return out
    })
  }

  dispose() {
    this._oscillators.map(o => o.dispose())
    this.dispose()
  }
}
