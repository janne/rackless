import { FC } from "react";

export { default as Amplifier } from "./Amplifier";
export { default as Envelope } from "./Envelope";
export { default as Feedback } from "./Feedback";
export { default as Filter } from "./Filter";
export { default as Math } from "./Math";
export { default as Midi } from "./Midi";
export { default as Mult } from "./Mult";
export { default as Noise } from "./Noise";
export { default as SlewLimit } from "./SlewLimit";
export { default as Oscillator } from "./Oscillator";
export { default as Oscilloscope } from "./Oscilloscope";
export { default as Output } from "./Output";

export interface Module {
  inputs: any;
  outputs: any;
  controls: any;
  setup: any;
  background: any;
}

export interface AudioNode {
  connect: (
    unit: AudioNode,
    outputNum?: number,
    inputNum?: number
  ) => AudioNode;
  chain: (...units: AudioNode[]) => AudioNode;
  dispose: () => void;
  [k: string]: any;
}

type Range = "audio" | "normal" | (number | string)[];

export interface Io {
  x: number;
  y: number;
  width?: number;
  Component?: FC<any>;
  range?: Range;
}

export interface Ios {
  [k: string]: Io;
}

export interface Dispose {
  (): void;
}

export interface Loop {
  (props: { [k: string]: any }, values: { [k: string]: any }): {
    [k: string]: any;
  };
}

export interface Setup {
  (
    inputs: { [k: string]: AudioNode },
    outputs: { [k: string]: AudioNode },
    controls?: { [k: string]: AudioNode }
  ): { dispose: Dispose; loop?: Loop } | void;
}

export type ModuleType =
  | "Amplifier"
  | "Envelope"
  | "Feedback"
  | "Filter"
  | "Math"
  | "Midi"
  | "Mult"
  | "Noise"
  | "SlewLimit"
  | "Oscillator"
  | "Oscilloscope"
  | "Output";
