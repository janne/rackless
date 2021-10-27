import * as Tone from "tone";
import background from "./background.svg";
import { Ios, Setup } from "..";

const inputs: Ios = {
  cutoff: { x: 10, y: 175, range: "audio" },
  quality: { x: 10, y: 232 },
  in: { x: 10, y: 296, range: "audio" }
};

const outputs: Ios = {
  out: { x: 57, y: 296, range: "audio" }
};

const controls: Ios = {
  cutoff: { x: 48, y: 166, range: "audio" },
  quality: { x: 48, y: 223 },
  filterType: { x: 30, y: 60, range: ["lowpass", "highpass"] },
  slope: { x: 30, y: 116, range: [-12, -24] }
};

const setup: Setup = ({ inputs, outputs, controls }) => {
  const tones = {
    filter: new Tone.Filter(controls.cutoff.value, controls.filterType.value),
    plusCutoff: new Tone.Add(),
    plusQuality: new Tone.Add(),
    audioToFrequency: new Tone.WaveShaper(
      (x: number) => 220 * Math.pow(2, x * 5)
    ),
    multiply: new Tone.Multiply(20)
  };

  tones.filter.rolloff = controls.slope.value;

  controls.cutoff.connect(tones.plusCutoff, 0, 0);
  inputs.cutoff.connect(tones.plusCutoff, 0, 1);
  tones.plusCutoff.chain(tones.audioToFrequency, tones.filter.frequency);

  controls.quality.connect(tones.plusQuality, 0, 0);
  inputs.quality.connect(tones.plusQuality, 0, 1);
  tones.plusQuality.chain(tones.multiply, tones.filter.Q);

  inputs.in.chain(tones.filter, outputs.out);

  return { dispose: () => Object.values(tones).forEach((t) => t.dispose()) };
};

export default { inputs, outputs, controls, setup, background };
