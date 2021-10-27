import Tone from "tone";
import * as R from "ramda";
import webmidi, { Input } from "webmidi";
import background from "./background.svg";
import { Ios, Setup, Dispose } from "..";

const outputs: Ios = {
  voct: { x: 5, y: 313, range: "audio" },
  gate: { x: 36, y: 313 },
  velocity: { x: 5, y: 253 },
  pitch: { x: 36, y: 253, range: "audio" },
  cc1: { x: 5, y: 43 },
  cc2: { x: 36, y: 43 },
  cc3: { x: 5, y: 93 },
  cc4: { x: 36, y: 93 },
  cc5: { x: 5, y: 143 },
  cc6: { x: 36, y: 143 },
  cc7: { x: 5, y: 193 },
  cc8: { x: 36, y: 193 }
};

const initializeMidi = async (): Promise<Input> =>
  new Promise((resolve, reject) => {
    webmidi.enable((err) => {
      if (err) {
        reject(err);
        return;
      }

      if (webmidi.inputs.length < 1 || webmidi.inputs.length > 1) {
        reject("Attach exactly one midi controller");
        return;
      }

      resolve(webmidi.inputs[0]);
    });
  });

const setup: Setup = ({ outputs }) => {
  const tones = {
    voct: new Tone.Signal(0, Tone.Type.Audio),
    gate: new Tone.Signal(0, Tone.Type.Normal),
    velocity: new Tone.Signal(0, Tone.Type.Normal),
    pitch: new Tone.Signal(0, Tone.Type.Audio),
    cc1: new Tone.Signal(0, Tone.Type.Normal),
    cc2: new Tone.Signal(0, Tone.Type.Normal),
    cc3: new Tone.Signal(0, Tone.Type.Normal),
    cc4: new Tone.Signal(0, Tone.Type.Normal),
    cc5: new Tone.Signal(0, Tone.Type.Normal),
    cc6: new Tone.Signal(0, Tone.Type.Normal),
    cc7: new Tone.Signal(0, Tone.Type.Normal),
    cc8: new Tone.Signal(0, Tone.Type.Normal)
  };

  tones.voct.connect(outputs.voct);
  tones.gate.connect(outputs.gate);
  tones.velocity.connect(outputs.velocity);
  tones.pitch.connect(outputs.pitch);
  tones.cc1.connect(outputs.cc1);
  tones.cc2.connect(outputs.cc2);
  tones.cc3.connect(outputs.cc3);
  tones.cc4.connect(outputs.cc4);
  tones.cc5.connect(outputs.cc5);
  tones.cc6.connect(outputs.cc6);
  tones.cc7.connect(outputs.cc7);
  tones.cc8.connect(outputs.cc8);

  let midi: Input | null = null;
  let keys: number[] = [];

  initializeMidi().then((input) => {
    midi = input;

    const midiToVoct = R.clamp(0, 1, (keys[0] - 57) / (12 * 5) + 0.5);

    const get = <T, K extends keyof T>(obj: T, key: string): T[K] =>
      obj[key as K];

    input.addListener("controlchange", "all", (e) => {
      const cc = e.controller.number;
      if (cc < 1 || cc > 8) return;
      get(tones, `cc${cc}`).value = e.value / 127;
    });
    input.addListener("noteon", "all", (e) => {
      keys = [e.note.number, ...keys];
      tones.voct.value = midiToVoct;
      tones.velocity.value = e.velocity;
      tones.gate.value = 1;
    });
    input.addListener("noteoff", "all", (e) => {
      keys = R.without([e.note.number], keys);
      if (R.isEmpty(keys)) {
        tones.gate.value = 0;
        return;
      }
      tones.voct.value = midiToVoct;
    });
    input.addListener("pitchbend", "all", (e) => {
      tones.pitch.value = e.value * (1 / 5);
    });
  });

  const dispose: Dispose = () => {
    if (midi) {
      midi.removeListener();
    }
  };

  return { dispose };
};

export default { outputs, setup, background };
