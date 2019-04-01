import Tone from "tone"

const ranges = {
  audio: Tone.Type.AudioRange,
  normal: Tone.Type.NormalRange,
  frequency: Tone.Type.Frequency
}

export default class extends Tone.Instrument {
  tones = []

  constructor(pots, inputs, outputs, setup) {
    super()
    this.createInsOuts(Object.keys(inputs).length, Object.keys(outputs).length)

    this.inputs = {}
    this.outputs = {}
    this.pots = {}

    pots.forEach(pot => {
      this.pots[pot.name] = this.makeTone(Tone.Signal, 0, ranges[pot.range])
    })

    inputs.forEach((i, socketId) => {
      this.inputs[i.name] = this.makeTone(Tone.Signal, 0, ranges[i.range])
      this.input[socketId] = this.inputs[i.name]
    })

    outputs.forEach((o, socketId) => {
      this.outputs[o.name] = this.makeTone(Tone.Signal, 0, ranges[o.range])
      this.output[socketId] = this.outputs[o.name]
    })

    setup({
      make: this.makeTone,
      pots: this.pots,
      inputs: this.inputs,
      outputs: this.outputs
    })
  }

  makeTone = (Class, ...args) => {
    const tone = new Class(...args)
    this.tones.push(tone)
    return tone
  }

  dispose() {
    this.tones.forEach(t => t.dispose())
    super.dispose()
  }
}
