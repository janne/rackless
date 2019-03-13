import React from "react"
import Socket from "../Socket"
import Module from "../Module"
import background from "./background.svg"

export default ({ x, y, id }) => (
  <Module id={id} x={x} y={y} background={background}>
    <Socket x={15} y={175} />
    <Socket x={50} y={175} />
    <Socket x={87} y={175} />
    <Socket x={122} y={175} />
    <Socket x={15} y={222} />
    <Socket x={50} y={222} />
    <Socket x={87} y={222} />
    <Socket x={122} y={222} />
    <Socket x={15} y={290} />
    <Socket x={50} y={290} />
    <Socket x={87} y={290} />
    <Socket x={122} y={290} />
    <Socket x={15} y={337} />
    <Socket x={50} y={337} />
    <Socket x={87} y={337} />
    <Socket x={122} y={337} />
  </Module>
)
