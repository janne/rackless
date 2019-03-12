import React from "react"
import background from "./background.svg"
import Trimpot from "../Trimpot"
import Socket from "../Socket"

const styles = {
  content: { position: "absolute" },
  background: { height: 400 }
}

const VCO = ({ x, y, id, data, changeTrimpot }) => (
  <div style={{ ...styles.content, left: x, top: y }}>
    <img src={background} style={styles.background} alt="VCO" />
    <Trimpot x={54} y={60} width={50} mod={id} pot="freq" />
    <Trimpot x={28} y={150} mod={id} pot="fine" />
    <Trimpot x={103} y={150} mod={id} pot="pulseWidth" />
    <Trimpot x={28} y={220} mod={id} pot="fmCv" />
    <Trimpot x={103} y={220} mod={id} pot="pwmCv" />
    <Socket x={15} y={293} mod={id} />
    <Socket x={50} y={293} mod={id} />
    <Socket x={87} y={293} mod={id} />
    <Socket x={122} y={293} mod={id} />
    <Socket x={15} y={340} mod={id} />
    <Socket x={50} y={340} mod={id} />
    <Socket x={87} y={340} mod={id} />
    <Socket x={122} y={340} mod={id} />
  </div>
)

export default VCO
