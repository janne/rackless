import React from "react"
import { connect } from "react-redux"
import background from "./background.svg"
import { ZOOM } from "../../constants"
import { dispatchAndPersist, createCable } from "../../store/actions"
import { getDB } from "../../store/selectors"

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
  nextKey,
  x,
  y,
  moduleId,
  socketId,
  direction,
  dispatchAndPersist
}) => {
  const newCable = () => {
    dispatchAndPersist(createCable(nextKey, moduleId, socketId, randomColor()))
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

const mapStateToProps = state => {
  const ref = getDB(state).ref()
  return {
    nextKey: ref.child("cables").push().key
  }
}

const mapDispatchToProps = { dispatchAndPersist }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Socket)
