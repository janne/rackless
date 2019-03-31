import Tone from "tone"
import AudioToFrequency from "./AudioToFrequency"

const ranges = {
  audio: Tone.Type.AudioRange,
  normal: Tone.Type.NormalRange,
  frequency: Tone.Type.Frequency
}

export default class extends Tone.Instrument {
  tones = []

  makeTone(Class, ...args) {
    const tone = new Class(...args)
    this.tones.push(tone)
    return tone
  }

  constructor(pots = [], inputs = [], outputs = []) {
    super()
    this.createInsOuts(Object.keys(inputs).length, Object.keys(outputs).length)

    pots.forEach(pot => {
      this[pot.name] = this.makeTone(Tone.Signal, 0, ranges[pot.range])
    })

    inputs.forEach(i => {
      this[i.name] = this.makeTone(Tone.Signal, 0, ranges[i.range])
      this.input[i.socketId] = this[i.name]
    })

    outputs.forEach(o => {
      this[o.name] = this.makeTone(Tone.Signal, 0, ranges[o.range])
      this.output[o.socketId] = this[o.name]
    })

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

  dispose() {
    this.tones.forEach(t => t.dispose())
    super.dispose()
  }
}
