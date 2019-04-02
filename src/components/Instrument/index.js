import Tone from "tone"

const ranges = {
  audio: Tone.Type.AudioRange,
  normal: Tone.Type.NormalRange,
  frequency: Tone.Type.Frequency
}

export default class extends Tone.Instrument {
  tones = []

  constructor(controls, inputs, outputs, setup) {
    super()
    this.createInsOuts(Object.keys(inputs).length, Object.keys(outputs).length)

    this.inputs = {}
    this.outputs = {}
    this.controls = {}

    controls.forEach(control => {
      this.controls[control.name] = new Tone.Signal(0, ranges[control.range])
    })

    inputs.forEach((i, socketId) => {
      this.inputs[i.name] = new Tone.Signal(0, ranges[i.range])
      this.input[socketId] = this.inputs[i.name]
    })

    outputs.forEach((o, socketId) => {
      this.outputs[o.name] = new Tone.Signal(0, ranges[o.range])
      this.output[socketId] = this.outputs[o.name]
    })

    this.setupCallback = setup({
      controls: this.controls,
      inputs: this.inputs,
      outputs: this.outputs
    })
  }

  dispose() {
    Object.values(this.controls).forEach(t => t.dispose())
    Object.values(this.inputs).forEach(t => t.dispose())
    Object.values(this.outputs).forEach(t => t.dispose())
    if (typeof this.setupCallback === "function") this.setupCallback()
    super.dispose()
  }
}
