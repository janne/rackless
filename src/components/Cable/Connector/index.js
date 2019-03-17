import React, { useState, useEffect } from "react"
import Draggable from "react-draggable"
import background from "./background.svg"
import { ZOOM } from "../../../constants"

const styles = {
  content: {
    position: "absolute"
  },
  background: { width: 6.7 * ZOOM }
}

const Connector = ({ x, y }) => {
  const [pos, setPos] = useState({ x, y })
  useEffect(() => {
    setPos({ x, y })
  }, [x, y])
  return (
    <Draggable
      position={pos}
      onStop={(e, data) => {
        console.log(data.lastX, data.lastY)
      }}
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
}

export default Connector
