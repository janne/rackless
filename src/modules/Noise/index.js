import Tone from "tone"

export { default as background } from "./background.svg"

export const outputs = [
  { name: "white", x: 1.33, y: 21.33, range: "audio" },
  { name: "brown", x: 1.33, y: 54, range: "audio" },
  { name: "pink", x: 1.33, y: 86.33, range: "audio" }
]

export const setup = ({ outputs }) => {
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

  return () => {
    Object.values(tones).forEach(noise => {
      noise.dispose()
    })
  }
}
