import React from "react"
import { connect } from "react-redux"
import background from "./background.svg"
import { ZOOM } from "../../constants"
import { createCableAndPersist } from "../../store/actions"

const noop = () => {}

const styles = {
  content: { position: "absolute" },
  background: { width: 7 * ZOOM }
}

const COLORS = [
  "red",
  "green",
  "blue",
  "purple",
  "gray",
  "brown",
  "maroon",
  "navy",
  "orangered"
]
const randomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)]

const Socket = ({
  x,
  y,
  moduleId,
  socketId,
  direction,
  createCableAndPersist
}) => {
  const newCable = () => {
    createCableAndPersist(moduleId, socketId, randomColor())
  }
  return (
    <div
      className="draggable"
      style={{ ...styles.content, left: x * ZOOM, top: y * ZOOM }}
    >
      <img
        draggable={false}
        src={background}
        style={styles.background}
        alt="Socket"
        onClick={direction === "outputs" ? newCable : noop}
      />
    </div>
  )
}

const mapDispatchToProps = { createCableAndPersist }

export default connect(
  null,
  mapDispatchToProps
)(Socket)
