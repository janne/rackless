import Tone from "tone"

const ranges = {
  audio: Tone.Type.AudioRange,
  normal: Tone.Type.NormalRange,
  frequency: Tone.Type.Frequency
}

export default class extends Tone.Instrument {
  tones = []

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
  }

  makeTone(Class, ...args) {
    const tone = new Class(...args)
    this.tones.push(tone)
    return tone
  }

  dispose() {
    this.tones.forEach(t => t.dispose())
    super.dispose()
  }
}
