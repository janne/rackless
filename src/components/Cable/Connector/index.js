import React from "react"
import * as R from "ramda"
import Draggable from "react-draggable"
import background from "./background.svg"
import { ZOOM } from "../../../constants"

const styles = {
  content: {
    position: "absolute"
  },
  background: { width: 7 * ZOOM }
}

const noop = f => f

const Connector = ({ x, y, onDrag = noop, onStart = noop, onStop = noop }) => (
  <Draggable
    position={{ x, y }}
    onStart={(e, data) => onStart(R.pick(["x", "y"], data))}
    onStop={(e, data) => onStop(R.pick(["x", "y"], data))}
    onDrag={(e, data) => onDrag(R.pick(["x", "y"], data))}
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
