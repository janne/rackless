import React, { Fragment, useState } from "react"
import * as R from "ramda"
import { connect } from "react-redux"
import Draggable from "react-draggable"
import background from "./background.svg"
import { ZOOM } from "../../../constants"
import {
  dispatchAndPersist,
  createCable,
  dragConnector,
  moveConnector
} from "../../../store/actions"
import { getDB } from "../../../store/selectors"

const CENTER = 3.3 * ZOOM

const styles = {
  content: { position: "absolute" },
  background: { width: 7 * ZOOM },
  draggable: { cursor: "pointer" }
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
  const [newCable] = useState({
    x: x * ZOOM,
    y: y * ZOOM,
    key: nextKey
  })

  return (
    <Fragment>
      <div
        className="draggable"
        style={{ ...styles.content, left: x * ZOOM, top: y * ZOOM }}
      >
        <img
          draggable={false}
          src={background}
          style={styles.background}
          alt="Socket"
        />
      </div>
      {direction === "outputs" && (
        <Draggable
          position={R.pick(["x", "y"], newCable)}
          onStart={(e, data) => {
            dispatchAndPersist(
              createCable(newCable.key, moduleId, socketId, randomColor())
            )
          }}
          onDrag={(e, data) => {
            const pos = { x: e.x - CENTER, y: e.y - CENTER }
            dispatchAndPersist(dragConnector(newCable.key, "inputs", pos))
          }}
          onStop={(e, data) => {
            const pos = { x: e.x - CENTER, y: e.y - CENTER }
            dispatchAndPersist(moveConnector(newCable.key, "inputs", pos))
          }}
        >
          <div
            className="draggable"
            style={{
              top: 0,
              left: 0,
              position: "absolute",
              width: ZOOM * 7,
              height: ZOOM * 7
            }}
          />
        </Draggable>
      )}
    </Fragment>
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
