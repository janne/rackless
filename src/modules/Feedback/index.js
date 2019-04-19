import Tone from "tone"

import background from "./background.svg"

const inputs = {
  feedback: { x: 20, y: 83 },
  time: { x: 20, y: 176 },
  wet: { x: 20, y: 269 },
  in: { x: 5, y: 323 }
}

const outputs = { out: { x: 36, y: 323 } }

const controls = {
  feedback: { x: 12, y: 42 },
  time: { x: 12, y: 135 },
  wet: { x: 12, y: 228 }
}

const setup = ({ inputs, outputs, controls }) => {
  const tones = { feedback: new Tone.FeedbackDelay() }

  inputs.feedback.connect(tones.feedback.feedback)
  controls.feedback.connect(tones.feedback.feedback)
  inputs.time.connect(tones.feedback.delayTime)
  controls.time.connect(tones.feedback.delayTime)
  inputs.wet.connect(tones.feedback.wet)
  controls.wet.connect(tones.feedback.wet)
  inputs.in.chain(tones.feedback, outputs.out)

  return { dispose: () => Object.values(tones).forEach(t => t.dispose()) }
}

export default { inputs, outputs, controls, background, setup }
