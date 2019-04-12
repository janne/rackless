import Tone from "tone"
import * as R from "ramda"

const ranges = {
  audio: Tone.Type.AudioRange,
  normal: Tone.Type.NormalRange,
  frequency: Tone.Type.Frequency
}

const disposeTone = t => {
  if (t.dispose) t.dispose()
}

const length = R.compose(
  R.length,
  R.keys
)

export default class extends Tone.Instrument {
  constructor(controls, inputs, outputs, setup, values) {
    super()
    this.createInsOuts(length(inputs), length(outputs))

    this.inputs = {}
    this.outputs = {}
    this.controls = {}

    R.mapObjIndexed((control, name) => {
      if (Array.isArray(control.range)) {
        const value = R.isNil(values[name]) ? control.range[0] : values[name]
        this.controls[name] = { value }
        return
      }
      const defaultValue = control.range === "normal" ? 0.5 : 0
      this.controls[name] = new Tone.Signal(
        R.isNil(values[name]) ? defaultValue : values[name],
        ranges[control.range]
      )
    }, controls)

    if (length(inputs) === 1) {
      const name = R.head(R.keys(inputs))
      this.inputs[name] = this.input
    } else {
      R.addIndex(R.mapObjIndexed)((i, socketId, _, idx) => {
        this.inputs[socketId] = new Tone.Signal(0, ranges[i.range])
        this.input[idx] = this.inputs[socketId]
      }, inputs)
    }

    if (length(outputs) === 1) {
      const name = R.head(R.keys(outputs))
      this.outputs[name] = this.output
    } else {
      R.addIndex(R.mapObjIndexed)((o, socketId, _, idx) => {
        this.outputs[socketId] = new Tone.Signal(0, ranges[o.range])
        this.output[idx] = this.outputs[socketId]
      }, outputs)
    }

    this.setupCallback = setup({
      controls: this.controls,
      inputs: this.inputs,
      outputs: this.outputs
    })
  }

  dispose = () => {
    if (typeof this.setupCallback === "function") this.setupCallback()
    Object.values(this.controls).forEach(disposeTone)
    Object.values(this.inputs).forEach(disposeTone)
    Object.values(this.outputs).forEach(disposeTone)
    super.dispose()
  }
}
