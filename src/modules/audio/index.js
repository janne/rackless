import React from "react"
import Socket from "../Socket"
import background from "./background.svg"

const styles = {
  content: { position: "absolute" },
  background: { height: 400 }
}

export default ({ x, y }) => (
  <div style={{ ...styles.content, left: x, top: y }}>
    <img src={background} style={styles.background} alt="AudioInterface" />
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
  </div>
)
