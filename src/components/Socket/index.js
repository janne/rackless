import React from "react"
import { connect } from "react-redux"
import background from "./background.svg"
import { ZOOM } from "../../constants"
import { createCableFrom } from "../../store/actions"
const uuidv1 = require("uuid/v1")

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

const Socket = ({ x, y, id, name, createCableFrom }) => {
  const newCable = () => {
    createCableFrom(uuidv1(), id, name, randomColor())
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
        onClick={newCable}
      />
    </div>
  )
}

const mapDispatchToProps = { createCableFrom }

export default connect(
  null,
  mapDispatchToProps
)(Socket)
