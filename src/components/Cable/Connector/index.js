import React from "react"
import background from "./background.svg"
import { ZOOM } from "../../../constants"

const styles = {
  content: {
    position: "absolute"
  },
  background: { width: 6.7 * ZOOM }
}

const Connector = ({ x, y }) => {
  return (
    <div style={{ ...styles.content, left: x, top: y }}>
      <img
        draggable={false}
        src={background}
        style={styles.background}
        alt="Connector"
      />
    </div>
  )
}

export default Connector
