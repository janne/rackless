import React from "react"
import background from "./background.svg"

const styles = {
  content: { position: "absolute" }
}

export default ({ x, y, width = 30 }) => (
  <div style={{ ...styles.content, left: x, top: y }}>
    <img src={background} style={{ width }} alt="Trimpot" />
  </div>
)
