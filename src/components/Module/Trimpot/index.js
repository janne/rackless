import React from "react"
import * as R from "ramda"
import { DraggableCore } from "react-draggable"
import background from "./background.svg"

const CONTROL_DEGREES = 270

const Trimpot = ({ x, y, id, width = 36, range, name, value, setValue }) => {
  const currentValue = R.isNil(value) ? (R.isNil(range) ? 0.5 : 0) : value

  const styles = {
    content: { position: "absolute", cursor: "pointer" }
  }

  const dragHandler = (e, data) => {
    setValue(
      id,
      name,
      R.clamp(
        R.isNil(range) ? 0 : -1,
        1,
        currentValue + (data.deltaX - data.deltaY) / 300
      )
    )
    e.preventDefault()
  }

  const dblClickHandler = e => setValue(id, name, R.isNil(range) ? 0.5 : 0)

  return (
    <div
      className="draggable"
      style={{ ...styles.content, left: x, top: y }}
      onDoubleClick={dblClickHandler}
    >
      <DraggableCore onDrag={dragHandler}>
        <img
          draggable={false}
          src={background}
          style={{
            ...styles.img,
            width,
            transform: `rotate(${
              R.isNil(range)
                ? (currentValue - 0.5) * CONTROL_DEGREES
                : currentValue * (CONTROL_DEGREES / 2)
            }deg)`
          }}
          alt="Trimpot"
        />
      </DraggableCore>
    </div>
  )
}

export default Trimpot
