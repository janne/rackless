import Tone from "tone"

import background from "./background.svg"

const outputs = {
  white: { x: 4, y: 65, range: "audio" },
  brown: { x: 4, y: 163, range: "audio" },
  pink: { x: 4, y: 260, range: "audio" }
}

const setup = ({ outputs }) => {
  const tones = {
    pink: new Tone.Noise("pink"),
    brown: new Tone.Noise("brown"),
    white: new Tone.Noise("white")
  }

  Object.keys(tones).forEach(type => {
    const noise = tones[type]
    noise.connect(outputs[type])
    outputs[type].start = () => noise.start()
    outputs[type].stop = () => noise.stop()
  })

  return () => Object.values(tones).forEach(t => t.dispose())
}

export default { outputs, setup, background }
