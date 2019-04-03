import Tone from "tone"
import AudioToFrequency from "../AudioToFrequency"
export { default as background } from "./background.svg"

export const controls = [
  { name: "freq", x: 19.33, y: 24.66, range: "audio" },
  { name: "fine", x: 35.33, y: 24.66, range: "audio" },
  { name: "fmcv", x: 19, y: 53.33, range: "normal" },
  { name: "pwmcv", x: 19, y: 79.33, range: "normal" },
  { name: "pwidth", x: 35, y: 79.33, range: "audio" }
]

export const inputs = [
  { name: "voct", x: 4.33, y: 27.33, range: "normal" },
  { name: "fm", x: 4.33, y: 56, range: "audio" },
  { name: "pwm", x: 4.33, y: 82, range: "normal" }
]

export const outputs = [
  { name: "sine", x: 4.33, y: 106.66, range: "frequency" },
  { name: "triangle", x: 15.66, y: 106.66, range: "frequency" },
  { name: "sawtooth", x: 27, y: 106.66, range: "frequency" },
  { name: "square", x: 38, y: 106.66, range: "frequency" }
]

export const setup = ({ controls, inputs, outputs }) => {
  const types = ["sine", "triangle", "sawtooth", "square"]
  const tones = {}

  types.forEach(type => {
    tones[type] =
      type === "square"
        ? new Tone.PulseOscillator()
        : new Tone.Oscillator(0, type)

    // PWM
    if (type === "square") {
      tones.scaledPwm = new Tone.Gain()
      inputs.pwm.connect(tones.scaledPwm)
      controls.pwmcv.connect(tones.scaledPwm.gain)
      tones.plusPwidth = new Tone.Add()
      tones.scaledPwm.connect(tones.plusPwidth)
      controls.pwidth.connect(tones.plusPwidth)
      tones.plusPwidth.connect(tones[type].width)
    }

    // Fine
    tones.scaledFine = new Tone.Multiply(100)
    controls.fine.connect(tones.scaledFine)
    tones.scaledFine.connect(tones[type].detune)

    // Voct
    const plusVoct = new Tone.Add()
    controls.freq.connect(plusVoct, 0, 0)
    inputs.voct.connect(plusVoct, 0, 1)

    // FM
    const scaledFm = new Tone.Gain()
    inputs.fm.connect(scaledFm)
    controls.fmcv.connect(scaledFm.gain)
    const plusFm = new Tone.Add()
    plusVoct.connect(plusFm, 0, 0)
    scaledFm.connect(plusFm, 0, 1)

    tones.audioToFrequency = new AudioToFrequency(220)
    plusFm.chain(tones.audioToFrequency, tones[type].frequency)

    const output = outputs[type]
    output.start = () => tones[type].start()
    output.stop = () => tones[type].stop()
    tones[type].connect(output)

    return () => {
      Object.values(tones).forEach(t => t.dispose())
    }
  })
}
