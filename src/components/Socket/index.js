import React from "react"
import background from "./background.svg"
import { ZOOM } from "../../constants"

const styles = {
  content: { position: "absolute" },
  background: { width: 6.7 * ZOOM }
}

export default ({ x, y }) => (
  <div style={{ ...styles.content, left: x * ZOOM, top: y * ZOOM }}>
    <img
      draggable={false}
      src={background}
      style={styles.background}
      alt="Socket"
    />
  </div>
)
