import Tone from "tone";
import background from "./background.svg";
import { Ios, Setup, Loop, Dispose } from "..";

const controls: Ios = {
  attack: { x: 12, y: 42 },
  decay: { x: 12, y: 135 },
  ramp: { x: 15, y: 245, range: ["exp", "lin"] }
};

const inputs: Ios = {
  in: { x: 5, y: 312 },
  attack: { x: 20, y: 83 },
  decay: { x: 20, y: 176 }
};

const outputs: Ios = {
  out: { x: 36, y: 313 }
};

const setup: Setup = ({ inputs, outputs }) => {
  const tones = {
    analyser: new Tone.Analyser("waveform", 64),
    attack: new Tone.Analyser("waveform", 64),
    decay: new Tone.Analyser("waveform", 64),
    signal: new Tone.Signal()
  };

  inputs.in.connect(tones.analyser);
  inputs.attack.connect(tones.attack);
  inputs.decay.connect(tones.decay);
  tones.signal.connect(outputs.out);

  const dispose: Dispose = () =>
    Object.values(tones).forEach((t) => t.dispose());

  const loop: Loop = ({ sig }, values) => {
    const newSig = tones.analyser.getValue()[0] as number;
    if (newSig === sig) return { sig };
    const slope = newSig > sig ? "attack" : "decay";
    const controlTime = Math.pow(values[slope] || 0.5, 2) * 10;
    const signalTime = tones[slope].getValue()[0] as number;
    const time = controlTime + signalTime;

    if (time === 0) {
      tones.signal.value = newSig;
    } else if (values.ramp === "lin") {
      tones.signal.linearRampTo(newSig, time);
    } else {
      tones.signal.targetRampTo(newSig, time);
    }
    return { sig: newSig };
  };

  return { dispose, loop };
};

export default { background, controls, inputs, outputs, setup };
