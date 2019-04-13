import background from "./background.svg"

const inputs = { gate: { x: 5, y: 272 }, retrig: { x: 36, y: 272 } }

const outputs = {
  out: { range: "audio", x: 36, y: 323 },
  inv: { range: "audio", x: 5, y: 323 }
}

const controls = {
  attack: { x: 12, y: 37 },
  decay: { x: 12, y: 96 },
  release: { x: 12, y: 154 },
  sustain: { x: 12, y: 213 }
}

const setup = (inputs, outputs, controls, background) => {}

export default { inputs, outputs, controls, setup, background }
