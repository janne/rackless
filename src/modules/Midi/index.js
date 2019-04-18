import Tone from "tone"
import * as R from "ramda"
import webmidi from "webmidi"

import background from "./background.svg"

const outputs = {
  voct: { x: 14, y: 306, range: "audio" },
  gate: { x: 49, y: 306 },
  velocity: { x: 84, y: 306 },
  pitch: { x: 119, y: 306, range: "audio" }
}

const initializeMidi = async () =>
  new Promise((resolve, reject) => {
    webmidi.enable(err => {
      if (err) {
        reject(err)
        return
      }

      if (webmidi.inputs.length < 1 || webmidi.inputs.length > 1) {
        reject("Attach exactly one midi controller")
        return
      }

      resolve(webmidi.inputs[0])
    })
  })

const setup = ({ outputs }) => {
  const tones = {
    voct: new Tone.Signal(0, Tone.Type.Normal),
    gate: new Tone.Signal(0, Tone.Type.Normal),
    velocity: new Tone.Signal(0, Tone.Type.Normal),
    pitch: new Tone.Signal(0, Tone.Type.Normal)
  }

  tones.voct.connect(outputs.voct)
  tones.gate.connect(outputs.gate)
  tones.velocity.connect(outputs.velocity)
  tones.pitch.connect(outputs.pitch)

  let midi = null
  let keys = 0

  initializeMidi().then(input => {
    midi = input

    input.addListener("controlchange", "all", e => {
      console.log("cc", e.controller.number, e.value)
    })
    input.addListener("noteon", "all", e => {
      keys++
      tones.voct.value = R.clamp(0, 1, (e.note.number - 57) / (12 * 5) + 0.5)
      tones.velocity.value = e.velocity
      tones.gate.value = 1
    })
    input.addListener("noteoff", "all", e => {
      keys--
      if (keys === 0) tones.gate.value = 0
    })
    input.addListener("pitchbend", "all", e => {
      tones.pitch.value = e.value * (1 / 5)
    })
  })

  const dispose = () => {
    if (null) {
      midi.removeListener()
    }
  }

  return { dispose }
}

export default { outputs, setup, background }
