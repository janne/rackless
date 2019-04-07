import Tone from "tone"
import background from "./background.svg"

const controls = [
  { name: "freq", x: 58, y: 74, range: "audio" },
  { name: "fine", x: 106, y: 74, range: "audio" },
  { name: "fmcv", x: 57, y: 160, range: "normal" },
  { name: "pwmcv", x: 57, y: 238, range: "normal" },
  { name: "pwidth", x: 105, y: 238, range: "audio" }
]

const inputs = [
  { name: "voct", x: 13, y: 82, range: "normal" },
  { name: "fm", x: 13, y: 168, range: "audio" },
  { name: "pwm", x: 13, y: 246, range: "normal" }
]

const outputs = [
  { name: "sine", x: 13, y: 320, range: "frequency" },
  { name: "triangle", x: 47, y: 320, range: "frequency" },
  { name: "sawtooth", x: 81, y: 320, range: "frequency" },
  { name: "square", x: 114, y: 320, range: "frequency" }
]

const setup = ({ controls, inputs, outputs }) => {
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

    tones.audioToFrequency = new Tone.WaveShaper(x => 220 * Math.pow(2, x * 5))
    plusFm.chain(tones.audioToFrequency, tones[type].frequency)

    const output = outputs[type]
    output.start = () => tones[type].start()
    output.stop = () => tones[type].stop()
    tones[type].connect(output)
  })

  return () => Object.values(tones).forEach(t => t.dispose())
}

export default { inputs, outputs, controls, setup, background }
