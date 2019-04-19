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
  const tones = {
    feedback: new Tone.FeedbackDelay(),
    mulFeedack: new Tone.Pow(2),
    mulTime: new Tone.Pow(2),
    mulWet: new Tone.Pow(2)
  }

  inputs.feedback.chain(tones.mulFeedack, tones.feedback.feedback)
  controls.feedback.chain(tones.mulFeedack, tones.feedback.feedback)
  inputs.time.chain(tones.mulTime, tones.feedback.delayTime)
  controls.time.chain(tones.mulTime, tones.feedback.delayTime)
  inputs.wet.chain(tones.mulWet, tones.feedback.wet)
  controls.wet.chain(tones.mulWet, tones.feedback.wet)
  inputs.in.chain(tones.feedback, outputs.out)

  return { dispose: () => Object.values(tones).forEach(t => t.dispose()) }
}

export default { inputs, outputs, controls, background, setup }
