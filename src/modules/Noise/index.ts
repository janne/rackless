import * as Tone from "tone";
import background from "./background.svg";
import { Ios, Setup, Loop, Dispose } from "..";

const outputs: Ios = {
  white: { x: 4, y: 43, range: "audio" },
  brown: { x: 4, y: 93, range: "audio" },
  pink: { x: 4, y: 143, range: "audio" },
  out: { x: 4, y: 303, range: "audio" }
};

const inputs: Ios = {
  sample: { x: 5, y: 200, range: "audio" },
  hold: { x: 5, y: 250 }
};

const setup: Setup = ({ inputs, outputs }) => {
  const tones = {
    pink: new Tone.Noise("pink"),
    brown: new Tone.Noise("brown"),
    white: new Tone.Noise("white"),
    signal: new Tone.Signal(),
    sampleAnalyser: new Tone.Analyser("waveform", 64),
    holdAnalyser: new Tone.Analyser("waveform", 64)
  };

  inputs.hold.connect(tones.holdAnalyser);
  inputs.sample.connect(tones.sampleAnalyser);
  tones.signal.connect(outputs.out);

  const typesOfNoise: (keyof typeof tones)[] = ["white", "brown", "pink"];
  typesOfNoise.forEach((type) => {
    const noise = tones[type] as Tone.Noise;
    noise.connect(outputs[type]);
    outputs[type].start = () => noise.start();
    outputs[type].stop = () => noise.stop();
  });

  const dispose: Dispose = () =>
    Object.values(tones).forEach((t) => t.dispose());

  const gateFlip = (gate: boolean, values: Float32Array) => {
    if (!gate && values.some((v) => v > 0.8)) return true;
    if (gate && values.some((v) => v < 0.2)) return false;
    return gate;
  };

  const loop: Loop = (props) => {
    const { hold: previousHold } = props;

    const holdValues = tones.holdAnalyser.getValue() as Float32Array;

    const hold = gateFlip(previousHold, holdValues);

    if (hold && !previousHold)
      tones.signal.value = tones.sampleAnalyser.getValue()[0] as number;

    return { hold };
  };

  return { dispose, loop };
};

export default { inputs, outputs, setup, background };
