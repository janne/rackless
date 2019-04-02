import React from "react"
import * as R from "ramda"
import { DraggableCore } from "react-draggable"
import background from "./background.svg"
import { ZOOM } from "../../constants"

const CONTROL_DEGREES = 270

const Trimpot = ({
  x,
  y,
  id,
  width = 12,
  range = "normal",
  name,
  value = 0,
  setValue
}) => {
  const styles = {
    content: { position: "absolute" }
  }

  const dragHandler = (e, data) => {
    setValue(
      id,
      name,
      R.clamp(
        range === "normal" ? 0 : -1,
        1,
        value + (data.deltaX - data.deltaY) / 300
      )
    )
    e.preventDefault()
  }

  const dblClickHandler = e => setValue(id, name, 0)

  return (
    <div
      className="draggable"
      style={{ ...styles.content, left: x * ZOOM, top: y * ZOOM }}
      onDoubleClick={dblClickHandler}
    >
      <DraggableCore onDrag={dragHandler}>
        <img
          draggable={false}
          src={background}
          style={{
            ...styles.img,
            width: width * ZOOM,
            transform: `rotate(${
              range === "normal"
                ? (value - 0.5) * CONTROL_DEGREES
                : value * (CONTROL_DEGREES / 2)
            }deg)`
          }}
          alt="Trimpot"
        />
      </DraggableCore>
    </div>
  )
}

export default Trimpot
