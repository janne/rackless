import Tone from "tone"
import background from "./background.svg"

const controls = {
  freq: { x: 58, y: 54, range: "audio" },
  fine: { x: 105, y: 54, range: "audio" },
  fmcv: { x: 58, y: 135 },
  pwmcv: { x: 58, y: 218 },
  pwidth: { x: 105, y: 218, range: "audio" },
  oscType: { x: 107, y: 144, range: ["vco", "lfo"] }
}

const inputs = {
  voct: { x: 13, y: 62 },
  fm: { x: 14, y: 143, range: "audio" },
  pwm: { x: 13, y: 226 }
}

const outputs = {
  sine: { x: 14, y: 317, range: "audio" },
  triangle: { x: 48, y: 317, range: "audio" },
  sawtooth: { x: 82, y: 317, range: "audio" },
  square: { x: 115, y: 317, range: "audio" }
}

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

    const baseFreq =
      controls.oscType.value === "vco" ? 220 : 220 * Math.pow(2, -10)

    tones.audioToFrequency = new Tone.WaveShaper(
      x => baseFreq * Math.pow(2, x * 5)
    )
    plusFm.chain(tones.audioToFrequency, tones[type].frequency)

    const output = outputs[type]
    output.start = () => tones[type].start()
    output.stop = () => tones[type].stop()
    tones[type].connect(output)
  })

  return { dispose: () => Object.values(tones).forEach(t => t.dispose()) }
}

export default { inputs, outputs, controls, setup, background }
