export { default as Amplifier } from "./Amplifier"
export { default as Envelope } from "./Envelope"
export { default as Feedback } from "./Feedback"
export { default as Filter } from "./Filter"
export { default as Math } from "./Math"
export { default as Midi } from "./Midi"
export { default as Mult } from "./Mult"
export { default as Noise } from "./Noise"
export { default as SlewLimit } from "./SlewLimit"
export { default as Oscillator } from "./Oscillator"
export { default as Oscilloscope } from "./Oscilloscope"
export { default as Output } from "./Output"

export interface Module {
  inputs: any
  outputs: any
  controls: any
  setup: any
  background: any
}

export interface AudioNode {
  connect: (unit: AudioNode, outputNum?: number, inputNum?: number) => AudioNode
  chain: (...units: AudioNode[]) => AudioNode
  [k: string]: any
}

export interface Io {
  x: number
  y: number
  range?: "audio" | (number | string)[]
}

export interface Ios {
  [k: string]: Io
}

export interface Dispose {
  (): void
}

export interface Loop {
  (props: Ios, values: { [k: string]: any }): void
}

export interface Setup {
  (
    inputs: { [k: string]: AudioNode },
    outputs: { [k: string]: AudioNode },
    controls: { [k: string]: AudioNode }
  ): { dispose: Dispose; loop?: Loop }
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
  | "Output"
