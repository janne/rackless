import Tone from "tone"

const ranges = {
  audio: Tone.Type.AudioRange,
  normal: Tone.Type.NormalRange,
  frequency: Tone.Type.Frequency
}

export default class extends Tone.Instrument {
  constructor(controls, inputs, outputs, setup) {
    super()
    this.createInsOuts(inputs.length, outputs.length)

    this.inputs = {}
    this.outputs = {}
    this.controls = {}

    controls.forEach(control => {
      this.controls[control.name] = new Tone.Signal(0, ranges[control.range])
    })

    if (inputs.length === 1) {
      const name = inputs[0].name
      this.inputs[name] = this.input
    } else {
      inputs.forEach((i, socketId) => {
        this.inputs[i.name] = new Tone.Signal(0, ranges[i.range])
        this.input[socketId] = this.inputs[i.name]
      })
    }

    if (outputs.length === 1) {
      const name = outputs[0].name
      this.outputs[name] = this.output
    } else {
      outputs.forEach((o, socketId) => {
        this.outputs[o.name] = new Tone.Signal(0, ranges[o.range])
        this.output[socketId] = this.outputs[o.name]
      })
    }

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
