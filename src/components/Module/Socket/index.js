import React, { Fragment, useRef } from "react"
import * as R from "ramda"
import { connect } from "react-redux"
import { getDbKey } from "../../../firebase"
import Draggable from "react-draggable"
import background from "./background.svg"
import {
  dispatchAndPersist,
  createCable,
  dragConnector,
  moveConnector
} from "../../../store/actions"
import { HP_PIX, HEIGHT_PIX } from "../../../constants"

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
  moduleX,
  moduleY,
  moduleId,
  socketId,
  direction,
  dragConnector,
  dispatchAndPersist
}) => {
  const key = useRef(nextKey)
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
        position={{ x, y }}
        onStart={(e, data) => {
          dispatchAndPersist(
            createCable(
              key.current,
              moduleId,
              socketId,
              direction,
              randomColor()
            )
          )
        }}
        onDrag={(e, data) => {
          const pos = {
            x: data.x + moduleX,
            y: data.y + moduleY
          }
          dragConnector(key.current, toDirection, pos)
        }}
        onStop={(e, data) => {
          const pos = {
            x: data.x + moduleX,
            y: data.y + moduleY
          }
          dispatchAndPersist(moveConnector(key.current, toDirection, pos))
        }}
      >
        <div className="draggable" style={styles.handle} />
      </Draggable>
    </Fragment>
  )
}

const mapStateToProps = (state, { moduleId }) => {
  const { row, col } = R.pathOr({}, ["modules", moduleId], state)
  return {
    moduleX: col * HP_PIX,
    moduleY: row * HEIGHT_PIX,
    nextKey: getDbKey("cables")
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
