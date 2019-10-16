import React, { SFC } from "react"
import * as R from "ramda"
import Draggable from "react-draggable"
import background from "./background.svg"
import { Pos } from ".."

const styles = {
  container: { position: "absolute" as "absolute" },
  background: { width: 21 }
}

const noop = () => {}

interface ConnectorProps {
  x: number
  y: number
  onDrag: (pos: Pos) => void
  onStart: (pos: Pos) => void
  onStop: (pos: Pos) => void
  disabled: boolean
}

const Connector: SFC<ConnectorProps> = ({
  x,
  y,
  onDrag = noop,
  onStart = noop,
  onStop = noop,
  disabled
}) => (
  <Draggable
    position={{ x, y }}
    onStart={(_e, data) => onStart(R.pick(["x", "y"], data))}
    onStop={(_e, data) => onStop(R.pick(["x", "y"], data))}
    onDrag={(_e, data) => onDrag(R.pick(["x", "y"], data))}
  >
    <div
      style={{ ...styles.container, cursor: disabled ? "grabbing" : "grab" }}
    >
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
