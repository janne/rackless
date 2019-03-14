import React from "react"
import background from "./background.svg"

const styles = {
  content: { position: "absolute" },
  background: { height: 20 }
}

export default ({ x, y }) => (
  <div style={{ ...styles.content, left: x, top: y }}>
    <img
      draggable={false}
      src={background}
      style={styles.background}
      alt="Socket"
    />
  </div>
)
