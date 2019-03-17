import React from "react"
import Draggable from "react-draggable"
import background from "./background.svg"
import { ZOOM } from "../../../constants"

const styles = {
  content: {
    position: "absolute"
  },
  background: { width: 6.7 * ZOOM }
}

const Connector = ({ x, y, onDrag = f => f, onStop = f => f }) => (
  <Draggable
    position={{ x, y }}
    onStop={(e, data) => {
      onStop({ x: data.x, y: data.y })
    }}
    onDrag={(e, data) => onDrag({ x: data.x, y: data.y })}
  >
    <div style={{ ...styles.content }}>
      <img
        draggable={false}
        src={background}
        style={styles.background}
        alt="Connector"
      />
    </div>
  </Draggable>
)

export default Connector
