import Tone from "tone"

const ranges = {
  audio: Tone.Type.AudioRange,
  normal: Tone.Type.NormalRange,
  frequency: Tone.Type.Frequency
}

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
