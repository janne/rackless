import background from "./background.svg"

const controls = [
  { name: "level1", x: 47, y: 37, range: "normal" },
  { name: "level2", x: 47, y: 180, range: "normal" }
]

const inputs = []

const outputs = []

const setup = ({ inputs, outputs, controls, background }) => {
  const tones = []
  return () => Object.values(tones).forEach(t => t.dispose())
}

export default { inputs, outputs, controls, setup, background }
