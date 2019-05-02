import React, { Fragment, useRef } from "react"
import Draggable from "react-draggable"
import background from "./background.svg"

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
  moveConnector,
  createCable
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
        onStart={() => {
          createCable(key.current, moduleId, socketId, direction, randomColor())
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
          moveConnector(key.current, toDirection, pos)
        }}
      >
        <div className="draggable" style={styles.handle} />
      </Draggable>
    </Fragment>
  )
}

export default Socket
