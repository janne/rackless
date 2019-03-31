import Tone from "tone"

export default class extends Tone.Instrument {
  defaults = {
    gain: 1
  }

  tones = []

  makeTone(Class, ...args) {
    const tone = new Class(...args)
    this.tones.push(tone)
    return tone
  }

  constructor(opts) {
    super(opts)
    this.createInsOuts(5, 0)

    // Sockets
    this.i1 = this.makeTone(Tone.Signal, 0, Tone.Type.AudioRange)
    this.input[0] = this.i1
    this.i2 = this.makeTone(Tone.Signal, 0, Tone.Type.AudioRange)
    this.input[1] = this.i2
    this.i3l = this.makeTone(Tone.Signal, 0, Tone.Type.AudioRange)
    this.input[2] = this.i3l
    this.i3r = this.makeTone(Tone.Signal, 0, Tone.Type.AudioRange)
    this.input[3] = this.i3r
    this.pancv = this.makeTone(Tone.Signal, 0, Tone.Type.AudioRange)
    this.input[4] = this.pancv

    // Pots
    this.gain = this.makeTone(Tone.Signal, 0, Tone.Type.NormalRange)
    this.level1 = this.makeTone(Tone.Signal, 0, Tone.Type.NormalRange)
    this.pan1 = this.makeTone(Tone.Signal, 0, Tone.Type.AudioRange)
    this.level2 = this.makeTone(Tone.Signal, 0, Tone.Type.NormalRange)
    this.pan2 = this.makeTone(Tone.Signal, 0, Tone.Type.AudioRange)
    this.level3 = this.makeTone(Tone.Signal, 0, Tone.Type.NormalRange)

    this.masterGain = this.makeTone(Tone.Gain)
    this.gain.connect(this.masterGain.gain)
    this.masterGain.connect(Tone.Master)

    this.gain1 = this.makeTone(Tone.Gain)
    this.level1.connect(this.gain1.gain)
    this.panner1 = this.makeTone(Tone.Panner)
    this.pan1.connect(this.panner1.pan)
    this.input[0].chain(this.gain1, this.panner1, this.masterGain)

    this.gain2 = this.makeTone(Tone.Gain)
    this.level2.connect(this.gain2.gain)
    this.panner2 = this.makeTone(Tone.Panner)
    this.pan2adder = this.makeTone(Tone.Add)
    this.pan2.connect(this.pan2adder)
    this.pancv.connect(this.pan2adder)
    this.pan2adder.connect(this.panner2.pan)
    this.i2.chain(this.gain2, this.panner2, this.masterGain)
    this.gain3l = this.makeTone(Tone.Gain)
    this.level3.connect(this.gain3l.gain)
    this.panner3l = this.makeTone(Tone.Panner, -1)
    this.i3l.chain(this.gain3l, this.panner3l, this.masterGain)
    this.gain3r = this.makeTone(Tone.Gain)
    this.level3.connect(this.gain3r.gain)
    this.panner3r = this.makeTone(Tone.Panner, 1)
    this.i3r.chain(this.gain3r, this.panner3r, this.masterGain)
  }

  dispose() {
    this.tones.forEach(t => t.dispose())
    super.dispose()
  }
}
