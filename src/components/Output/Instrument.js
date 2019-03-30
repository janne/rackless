import Tone from "tone"

export default class extends Tone.Instrument {
  defaults = {
    gain: 1
  }

  constructor(opts) {
    super(opts)
    this.createInsOuts(5, 0)

    // Sockets
    this.i1 = this.input[0] = new Tone.Signal(0, Tone.Type.AudioRange)
    this.i2 = this.input[1] = new Tone.Signal(0, Tone.Type.AudioRange)
    this.i3l = this.input[2] = new Tone.Signal(0, Tone.Type.AudioRange)
    this.i3r = this.input[3] = new Tone.Signal(0, Tone.Type.AudioRange)
    this.pancv = this.input[4] = new Tone.Signal(0, Tone.Type.AudioRange)

    // Pots
    this.gain = new Tone.Signal(0, Tone.Type.NormalRange)
    this.level1 = new Tone.Signal(0, Tone.Type.NormalRange)
    this.pan1 = new Tone.Signal(0, Tone.Type.AudioRange)
    this.level2 = new Tone.Signal(0, Tone.Type.NormalRange)
    this.pan2 = new Tone.Signal(0, Tone.Type.AudioRange)
    this.level3 = new Tone.Signal(0, Tone.Type.NormalRange)

    this.masterGain = new Tone.Gain()
    this.gain.connect(this.masterGain.gain)
    this.masterGain.connect(Tone.Master)

    this.gain1 = new Tone.Gain()
    this.level1.connect(this.gain1.gain)
    this.panner1 = new Tone.Panner()
    this.pan1.connect(this.panner1.pan)
    this.i1.chain(this.gain1, this.panner1, this.masterGain)

    this.gain2 = new Tone.Gain()
    this.level2.connect(this.gain2.gain)
    this.panner2 = new Tone.Panner()
    this.pan2adder = new Tone.Add()
    this.pan2.connect(this.pan2adder)
    this.pancv.connect(this.pan2adder)
    this.pan2adder.connect(this.panner2.pan)
    this.i2.chain(this.gain2, this.panner2, this.masterGain)
    this.gain3l = new Tone.Gain()
    this.level3.connect(this.gain3l.gain)
    this.panner3l = new Tone.Panner(-1)
    this.i3l.chain(this.gain3l, this.panner3l, this.masterGain)
    this.gain3r = new Tone.Gain()
    this.level3.connect(this.gain3r.gain)
    this.panner3r = new Tone.Panner(1)
    this.i3r.chain(this.gain3r, this.panner3r, this.masterGain)
  }
}
