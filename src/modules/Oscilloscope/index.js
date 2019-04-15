import React from "react"
import background from "./background.svg"

const Component = props => <div style={{ width: 144, height: 144 }} />

const controls = {
  select: { x: 11, y: 201 },
  left: { x: 58, y: 201 },
  right: { x: 105, y: 201 },
  monitor: { x: 4, y: 38, Component }
}

const inputs = {
  a: { x: 15, y: 264 },
  b: { x: 49, y: 264 },
  c: { x: 83, y: 264 },
  d: { x: 117, y: 264 }
}

const outputs = {
  a: { x: 15, y: 309 },
  b: { x: 49, y: 309 },
  c: { x: 83, y: 309 },
  d: { x: 117, y: 309 }
}

const setup = ({ inputs, outputs }) => {
  inputs.a.connect(outputs.a)
  inputs.b.connect(outputs.b)
  inputs.c.connect(outputs.c)
  inputs.d.connect(outputs.d)
}

export default { controls, inputs, outputs, setup, background }
