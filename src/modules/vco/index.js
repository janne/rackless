import React from "react"
import background from "./background.svg"
import Trimpot from "../Trimpot"
import Socket from "../Socket"

const styles = {
  content: { position: "absolute" },
  background: { height: 400 }
}

export default ({ x, y }) => (
  <div style={{ ...styles.content, left: x, top: y }}>
    <img src={background} style={styles.background} alt="VCO" />
    <Trimpot x={54} y={60} width={50} />
    <Trimpot x={28} y={150} />
    <Trimpot x={103} y={150} />
    <Trimpot x={28} y={220} />
    <Trimpot x={103} y={220} />
    <Socket x={15} y={293} />
    <Socket x={50} y={293} />
    <Socket x={87} y={293} />
    <Socket x={122} y={293} />
    <Socket x={15} y={340} />
    <Socket x={50} y={340} />
    <Socket x={87} y={340} />
    <Socket x={122} y={340} />
  </div>
)
