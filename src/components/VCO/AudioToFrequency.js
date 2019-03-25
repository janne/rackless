import Tone from "tone"

class AudioToFrequency extends Tone.Signal {
  constructor(baseFreq) {
    super()
    this.input = new Tone.Signal(0, Tone.Type.AudioRange)
    this.converter = new Tone.WaveShaper(x => baseFreq * Math.pow(2, x * 4))
    this.output = new Tone.Signal(0, Tone.Type.Frequency)
    this.input.chain(this.converter, this.output)
  }

  dispose() {
    Tone.Signal.prototype.dispose.call(this)
    this.converter.dispose()
    this.input.dispose()
    this.output.dispose()
  }
}

export default AudioToFrequency
