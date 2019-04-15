import Tone from "tone"
import * as R from "ramda"

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
      const defaultValue = R.isNil(control.range) ? 0.5 : 0
      this.controls[name] = new Tone.Signal(
        R.isNil(values[name]) ? defaultValue : values[name]
      )
      this.controls[name].ref = control.ref
    }, controls)

    if (length(inputs) === 1) {
      const name = R.head(R.keys(inputs))
      this.inputs[name] = this.input
    } else {
      R.addIndex(R.mapObjIndexed)((i, socketId, _, idx) => {
        this.inputs[socketId] = new Tone.Signal()
        this.input[idx] = this.inputs[socketId]
      }, inputs)
    }

    if (length(outputs) === 1) {
      const name = R.head(R.keys(outputs))
      this.outputs[name] = this.output
    } else {
      R.addIndex(R.mapObjIndexed)((o, socketId, _, idx) => {
        this.outputs[socketId] = new Tone.Signal()
        this.output[idx] = this.outputs[socketId]
      }, outputs)
    }

    const setupReturn = setup({
      controls: this.controls,
      inputs: this.inputs,
      outputs: this.outputs
    })

    const { dispose, loop } = setupReturn || {}
    this.instrumentDispose = dispose
    this.loop = loop
  }

  dispose = () => {
    if (typeof this.instrumentDispose === "function") this.instrumentDispose()
    this.loop = null
    Object.values(this.controls).forEach(disposeTone)
    Object.values(this.inputs).forEach(disposeTone)
    Object.values(this.outputs).forEach(disposeTone)
    super.dispose()
  }
}
