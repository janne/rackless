import React, { Fragment, useState } from "react"
import * as R from "ramda"
import { connect } from "react-redux"
import Draggable from "react-draggable"
import background from "./background.svg"
import {
  dispatchAndPersist,
  createCable,
  dragConnector,
  moveConnector
} from "../../../store/actions"
import { getDB } from "../../../store/selectors"

const CENTER = 10

const styles = {
  content: { position: "absolute" },
  background: { width: 21 },
  handle: {
    top: 0,
    left: 0,
    position: "absolute",
    width: 21,
    height: 21,
    cursor: "pointer"
  }
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
  dragConnector,
  dispatchAndPersist
}) => {
  const [newCable] = useState({
    x: x,
    y: y,
    key: nextKey
  })
  const toDirection = direction === "outputs" ? "inputs" : "outputs"

  return (
    <Fragment>
      <div className="draggable" style={{ ...styles.content, left: x, top: y }}>
        <img
          draggable={false}
          src={background}
          style={styles.background}
          alt="Socket"
        />
      </div>
      <Draggable
        position={R.pick(["x", "y"], newCable)}
        onStart={(e, data) => {
          dispatchAndPersist(
            createCable(
              newCable.key,
              moduleId,
              socketId,
              direction,
              randomColor()
            )
          )
        }}
        onDrag={e => {
          const pos = { x: e.x - CENTER, y: e.y - CENTER }
          dragConnector(newCable.key, toDirection, pos)
        }}
        onStop={e => {
          const pos = { x: e.x - CENTER, y: e.y - CENTER }
          dispatchAndPersist(moveConnector(newCable.key, toDirection, pos))
        }}
      >
        <div className="draggable" style={styles.handle} />
      </Draggable>
    </Fragment>
  )
}

const mapStateToProps = state => {
  const ref = getDB(state).ref()
  return {
    nextKey: ref.child("cables").push().key
  }
}

const mapDispatchToProps = {
  dispatchAndPersist,
  dragConnector
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Socket)
